import type {
  Bounds,
  DetectedText,
  ProcessingOptions,
} from "../document/types";

export type Plane = [number, number, number];

export type BackgroundModel = {
  bounds: Bounds;
  planes: [Plane, Plane, Plane];
  flatColor: [number, number, number];
  fitError: number;
  variance: number;
  // Variance of a thin ring immediately around the glyph. Distant graphics
  // in the padded model window must not hide a locally flat background.
  localVariance: number;
  localFitError: number;
  edgeDensity: number;
  // Lab median and p75 spread of the original ring, used to reject a flat or
  // gradient fill that does not match the surviving neighbors.
  ringMedian: [number, number, number];
  ringSpread: number;
};

export type GlyphSegmentation = {
  detection: DetectedText;
  bounds: Bounds;
  width: number;
  height: number;
  coreMask: Uint8Array;
  effectMask: Uint8Array;
  removalMask: Uint8Array;
  softMask: Uint8ClampedArray;
  model: BackgroundModel;
  textColor: string;
  confidence: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const offset = (x: number, y: number, width: number) => (y * width + x) * 4;

const percentile = (values: number[], fraction: number) => {
  if (!values.length) return 0;
  values.sort((a, b) => a - b);
  return values[Math.floor((values.length - 1) * fraction)];
};

const solve3x3 = (matrix: number[][], vector: number[]): Plane => {
  const rows = matrix.map((row, index) => [...row, vector[index]]);
  for (let column = 0; column < 3; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < 3; row += 1) {
      if (Math.abs(rows[row][column]) > Math.abs(rows[pivot][column]))
        pivot = row;
    }
    [rows[column], rows[pivot]] = [rows[pivot], rows[column]];
    const divisor = rows[column][column];
    if (Math.abs(divisor) < 1e-8) {
      return [0, 0, vector[0] / Math.max(1, matrix[0][0])];
    }
    for (let value = column; value < 4; value += 1) {
      rows[column][value] /= divisor;
    }
    for (let row = 0; row < 3; row += 1) {
      if (row === column) continue;
      const factor = rows[row][column];
      for (let value = column; value < 4; value += 1) {
        rows[row][value] -= factor * rows[column][value];
      }
    }
  }
  return [rows[0][3], rows[1][3], rows[2][3]];
};

type Sample = [number, number, number, number, number];

const fitPlanes = (samples: Sample[]) => {
  const normal = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  const targets = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  for (const [x, y, red, green, blue] of samples) {
    const basis = [x, y, 1];
    for (let row = 0; row < 3; row += 1) {
      for (let column = 0; column < 3; column += 1) {
        normal[row][column] += basis[row] * basis[column];
      }
      targets[0][row] += basis[row] * red;
      targets[1][row] += basis[row] * green;
      targets[2][row] += basis[row] * blue;
    }
  }
  return targets.map((target) =>
    solve3x3(
      normal.map((row) => [...row]),
      target,
    ),
  ) as [Plane, Plane, Plane];
};

const predict = (
  planes: [Plane, Plane, Plane],
  normalizedX: number,
  normalizedY: number,
) =>
  planes.map((plane) =>
    clamp(plane[0] * normalizedX + plane[1] * normalizedY + plane[2], 0, 255),
  ) as [number, number, number];

const srgbToLinear = (value: number) => {
  const normalized = value / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
};

const rgbToLab = (color: readonly number[]) => {
  const red = srgbToLinear(color[0]);
  const green = srgbToLinear(color[1]);
  const blue = srgbToLinear(color[2]);
  const x = (red * 0.4124 + green * 0.3576 + blue * 0.1805) / 0.95047;
  const y = red * 0.2126 + green * 0.7152 + blue * 0.0722;
  const z = (red * 0.0193 + green * 0.1192 + blue * 0.9505) / 1.08883;
  const transform = (value: number) =>
    value > 0.008856 ? Math.cbrt(value) : 7.787 * value + 16 / 116;
  const fx = transform(x);
  const fy = transform(y);
  const fz = transform(z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
};

const labDistance = (left: readonly number[], right: readonly number[]) => {
  const leftLab = rgbToLab(left);
  const rightLab = rgbToLab(right);
  const lightness = leftLab[0] - rightLab[0];
  const greenRed = leftLab[1] - rightLab[1];
  const blueYellow = leftLab[2] - rightLab[2];
  return Math.sqrt(
    lightness * lightness + greenRed * greenRed + blueYellow * blueYellow,
  );
};

export const predictBackground = (
  model: BackgroundModel,
  globalX: number,
  globalY: number,
) =>
  predict(
    model.planes,
    (globalX - model.bounds.x) / Math.max(1, model.bounds.width),
    (globalY - model.bounds.y) / Math.max(1, model.bounds.height),
  );

const outsideRect = (x: number, y: number, bounds: Bounds) =>
  x < bounds.x ||
  x > bounds.x + bounds.width ||
  y < bounds.y ||
  y > bounds.y + bounds.height;

const chebyshevToRect = (x: number, y: number, bounds: Bounds) => {
  const dx =
    x < bounds.x
      ? bounds.x - x
      : x > bounds.x + bounds.width
        ? x - (bounds.x + bounds.width)
        : 0;
  const dy =
    y < bounds.y
      ? bounds.y - y
      : y > bounds.y + bounds.height
        ? y - (bounds.y + bounds.height)
        : 0;
  return Math.max(dx, dy);
};

const localRingBand = (textHeight: number) =>
  Math.max(4, Math.min(16, Math.round(textHeight * 0.1)));

const fitBackgroundModel = (
  image: ImageData,
  textBounds: Bounds,
): BackgroundModel => {
  const margin = Math.max(8, Math.round(textBounds.height * 0.75));
  const left = clamp(Math.floor(textBounds.x - margin), 0, image.width - 1);
  const top = clamp(Math.floor(textBounds.y - margin), 0, image.height - 1);
  const right = clamp(
    Math.ceil(textBounds.x + textBounds.width + margin),
    left + 1,
    image.width,
  );
  const bottom = clamp(
    Math.ceil(textBounds.y + textBounds.height + margin),
    top + 1,
    image.height,
  );
  const bounds = { x: left, y: top, width: right - left, height: bottom - top };
  const innerMargin = Math.max(2, Math.round(textBounds.height * 0.12));
  const rawSamples: Sample[] = [];
  const step = Math.max(
    1,
    Math.floor(Math.min(bounds.width, bounds.height) / 96),
  );

  for (let y = top; y < bottom; y += step) {
    for (let x = left; x < right; x += step) {
      const insideText =
        x >= textBounds.x - innerMargin &&
        x <= textBounds.x + textBounds.width + innerMargin &&
        y >= textBounds.y - innerMargin &&
        y <= textBounds.y + textBounds.height + innerMargin;
      if (insideText) continue;
      const source = offset(x, y, image.width);
      rawSamples.push([
        (x - left) / Math.max(1, bounds.width),
        (y - top) / Math.max(1, bounds.height),
        image.data[source],
        image.data[source + 1],
        image.data[source + 2],
      ]);
    }
  }

  let planes = fitPlanes(rawSamples);
  const ranked = rawSamples
    .map((sample) => {
      const predicted = predict(planes, sample[0], sample[1]);
      return {
        sample,
        error:
          (sample[2] - predicted[0]) ** 2 +
          (sample[3] - predicted[1]) ** 2 +
          (sample[4] - predicted[2]) ** 2,
      };
    })
    .sort((leftSample, rightSample) => leftSample.error - rightSample.error);
  const robustSamples = ranked
    .slice(0, Math.max(6, Math.ceil(ranked.length * 0.78)))
    .map((item) => item.sample);
  planes = fitPlanes(robustSamples);

  const channels = [0, 1, 2].map((channel) =>
    robustSamples.map((sample) => sample[channel + 2]).sort((a, b) => a - b),
  );
  const flatColor = channels.map(
    (channel) => channel[Math.floor(channel.length / 2)] ?? 255,
  ) as [number, number, number];

  let fitError = 0;
  let variance = 0;
  for (const sample of robustSamples) {
    const predicted = predict(planes, sample[0], sample[1]);
    for (let channel = 0; channel < 3; channel += 1) {
      fitError += (sample[channel + 2] - predicted[channel]) ** 2;
      variance += (sample[channel + 2] - flatColor[channel]) ** 2;
    }
  }

  let edges = 0;
  let comparisons = 0;
  for (let y = top + step; y < bottom; y += step) {
    for (let x = left + step; x < right; x += step) {
      const current = offset(x, y, image.width);
      const previousX = offset(x - step, y, image.width);
      const previousY = offset(x, y - step, image.width);
      const horizontal =
        Math.abs(image.data[current] - image.data[previousX]) +
        Math.abs(image.data[current + 1] - image.data[previousX + 1]) +
        Math.abs(image.data[current + 2] - image.data[previousX + 2]);
      const vertical =
        Math.abs(image.data[current] - image.data[previousY]) +
        Math.abs(image.data[current + 1] - image.data[previousY + 1]) +
        Math.abs(image.data[current + 2] - image.data[previousY + 2]);
      if (horizontal > 65 || vertical > 65) edges += 1;
      comparisons += 1;
    }
  }

  const divisor = Math.max(1, robustSamples.length * 3);
  const fitErrorMean = fitError / divisor;
  const varianceMean = variance / divisor;
  return {
    bounds,
    planes,
    flatColor,
    fitError: fitErrorMean,
    variance: varianceMean,
    localVariance: varianceMean,
    localFitError: fitErrorMean,
    edgeDensity: edges / Math.max(1, comparisons),
    ringMedian: flatColor,
    ringSpread: 0,
  };
};

const morph = (
  source: Uint8Array,
  width: number,
  height: number,
  radius: number,
  operation: "dilate" | "erode",
) => {
  if (radius <= 0) return new Uint8Array(source);
  const output = new Uint8Array(source.length);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let value = operation === "erode" ? 255 : 0;
      outer: for (let offsetY = -radius; offsetY <= radius; offsetY += 1) {
        for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
          if (offsetX * offsetX + offsetY * offsetY > radius * radius) continue;
          const sampleX = x + offsetX;
          const sampleY = y + offsetY;
          const sample =
            sampleX >= 0 && sampleX < width && sampleY >= 0 && sampleY < height
              ? source[sampleY * width + sampleX]
              : 0;
          if (operation === "dilate" && sample) {
            value = 255;
            break outer;
          }
          if (operation === "erode" && !sample) {
            value = 0;
            break outer;
          }
        }
      }
      output[y * width + x] = value;
    }
  }
  return output;
};

const selectCoreColorClusters = (
  image: ImageData,
  bounds: Bounds,
  core: Uint8Array,
  residuals: Float32Array,
) => {
  const clusters = new Map<
    number,
    { count: number; residual: number; color: [number, number, number] }
  >();
  for (let y = 0; y < bounds.height; y += 1) {
    for (let x = 0; x < bounds.width; x += 1) {
      const local = y * bounds.width + x;
      if (!core[local]) continue;
      const source = offset(bounds.x + x, bounds.y + y, image.width);
      const red = image.data[source];
      const green = image.data[source + 1];
      const blue = image.data[source + 2];
      const key = (red >> 5) * 64 + (green >> 5) * 8 + (blue >> 5);
      const cluster = clusters.get(key) ?? {
        count: 0,
        residual: 0,
        color: [0, 0, 0] as [number, number, number],
      };
      cluster.count += 1;
      cluster.residual += residuals[local];
      cluster.color[0] += red;
      cluster.color[1] += green;
      cluster.color[2] += blue;
      clusters.set(key, cluster);
    }
  }
  const ranked = [...clusters.entries()].sort(
    ([, left], [, right]) =>
      right.count * (right.residual / right.count) -
      left.count * (left.residual / left.count),
  );
  const corePixels = ranked.reduce(
    (total, [, cluster]) => total + cluster.count,
    0,
  );
  const selected = new Set<number>();
  let selectedPixels = 0;
  for (const [key, cluster] of ranked.slice(0, 4)) {
    selected.add(key);
    selectedPixels += cluster.count;
    if (selectedPixels >= corePixels * 0.82) break;
  }
  if (corePixels < 20 || selected.size === 0) return core;

  const filtered = new Uint8Array(core.length);
  for (let y = 0; y < bounds.height; y += 1) {
    for (let x = 0; x < bounds.width; x += 1) {
      const local = y * bounds.width + x;
      if (!core[local]) continue;
      const source = offset(bounds.x + x, bounds.y + y, image.width);
      const key =
        (image.data[source] >> 5) * 64 +
        (image.data[source + 1] >> 5) * 8 +
        (image.data[source + 2] >> 5);
      if (selected.has(key)) filtered[local] = 255;
    }
  }
  return filtered;
};

const growEffects = (
  core: Uint8Array,
  residuals: Float32Array,
  width: number,
  weakThreshold: number,
  maxDistance: number,
) => {
  const grown = new Uint8Array(core);
  const distances = new Uint16Array(core.length);
  const queue = new Int32Array(core.length);
  let read = 0;
  let write = 0;
  for (let index = 0; index < core.length; index += 1) {
    if (!core[index]) continue;
    queue[write] = index;
    write += 1;
  }
  const neighbors = [
    -width - 1,
    -width,
    -width + 1,
    -1,
    1,
    width - 1,
    width,
    width + 1,
  ];
  while (read < write) {
    const current = queue[read];
    read += 1;
    const x = current % width;
    const y = Math.floor(current / width);
    const nextDistance = distances[current] + 1;
    if (nextDistance > maxDistance) continue;
    for (const delta of neighbors) {
      const next = current + delta;
      if (next < 0 || next >= core.length || grown[next]) continue;
      const nextX = next % width;
      const nextY = Math.floor(next / width);
      if (Math.abs(nextX - x) > 1 || Math.abs(nextY - y) > 1) continue;
      if (residuals[next] < weakThreshold) continue;
      grown[next] = 255;
      distances[next] = nextDistance;
      queue[write] = next;
      write += 1;
    }
  }
  return grown;
};

const textColorFromMask = (
  image: ImageData,
  bounds: Bounds,
  core: Uint8Array,
  residuals: Float32Array,
) => {
  const pixels: Array<{ residual: number; color: [number, number, number] }> =
    [];
  for (let y = 0; y < bounds.height; y += 1) {
    for (let x = 0; x < bounds.width; x += 1) {
      const local = y * bounds.width + x;
      if (!core[local]) continue;
      const source = offset(bounds.x + x, bounds.y + y, image.width);
      pixels.push({
        residual: residuals[local],
        color: [
          image.data[source],
          image.data[source + 1],
          image.data[source + 2],
        ],
      });
    }
  }
  pixels.sort((left, right) => right.residual - left.residual);
  const strongest = pixels.slice(
    0,
    Math.max(1, Math.ceil(pixels.length * 0.45)),
  );
  const color = [0, 1, 2].map(
    (channel) =>
      strongest.reduce((sum, pixel) => sum + pixel.color[channel], 0) /
      strongest.length,
  );
  return `#${color
    .map((value) =>
      clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0"),
    )
    .join("")}`;
};

export const segmentGlyphs = (
  image: ImageData,
  detection: DetectedText,
  options: ProcessingOptions,
): GlyphSegmentation => {
  const model = fitBackgroundModel(image, detection.bounds);
  const { bounds } = model;
  const size = bounds.width * bounds.height;
  const residuals = new Float32Array(size);
  const ringResiduals: number[] = [];
  const ringSamples: Sample[] = [];
  const candidateMargin = Math.max(
    2,
    Math.round(detection.bounds.height * 0.28),
  );
  const ringBand = localRingBand(detection.bounds.height);

  for (let y = 0; y < bounds.height; y += 1) {
    for (let x = 0; x < bounds.width; x += 1) {
      const globalX = bounds.x + x;
      const globalY = bounds.y + y;
      const source = offset(globalX, globalY, image.width);
      const predicted = predictBackground(model, globalX, globalY);
      const observed = [
        image.data[source],
        image.data[source + 1],
        image.data[source + 2],
      ];
      const residual = labDistance(observed, predicted);
      residuals[y * bounds.width + x] = residual;
      const ringDistance = chebyshevToRect(globalX, globalY, detection.bounds);
      if (
        outsideRect(globalX, globalY, detection.bounds) &&
        ringDistance <= ringBand
      ) {
        ringResiduals.push(residual);
        ringSamples.push([
          (globalX - bounds.x) / Math.max(1, bounds.width),
          (globalY - bounds.y) / Math.max(1, bounds.height),
          observed[0],
          observed[1],
          observed[2],
        ]);
      }
    }
  }

  if (ringSamples.length >= 6) {
    const localChannels = [0, 1, 2].map((channel) =>
      ringSamples.map((sample) => sample[channel + 2]).sort((a, b) => a - b),
    );
    const localFlat = localChannels.map(
      (channel) => channel[Math.floor(channel.length / 2)] ?? 255,
    ) as [number, number, number];
    let localVariance = 0;
    let localFitError = 0;
    for (const sample of ringSamples) {
      const predicted = predict(model.planes, sample[0], sample[1]);
      for (let channel = 0; channel < 3; channel += 1) {
        localVariance += (sample[channel + 2] - localFlat[channel]) ** 2;
        localFitError += (sample[channel + 2] - predicted[channel]) ** 2;
      }
    }
    const divisor = Math.max(1, ringSamples.length * 3);
    model.localVariance = localVariance / divisor;
    model.localFitError = localFitError / divisor;
    model.ringMedian = localFlat;
    model.ringSpread = percentile(
      ringSamples.map((sample) =>
        labDistance([sample[2], sample[3], sample[4]], localFlat),
      ),
      0.75,
    );
    if (model.localVariance < 105) {
      model.flatColor = localFlat;
    }
  }

  const noise90 = percentile(ringResiduals, 0.9);
  const noise75 = percentile(ringResiduals, 0.75);
  const sensitivityFloor = options.maskThreshold * 0.42;
  const coreThreshold = Math.max(sensitivityFloor, noise90 + 5);
  const weakThreshold = Math.max(4, noise75 + 2, coreThreshold * 0.42);
  let core: Uint8Array<ArrayBufferLike> = new Uint8Array(size);
  const expectedArea = Math.max(
    1,
    detection.bounds.width * detection.bounds.height,
  );
  let seeded = 0;
  for (let y = 0; y < bounds.height; y += 1) {
    for (let x = 0; x < bounds.width; x += 1) {
      const globalX = bounds.x + x;
      const globalY = bounds.y + y;
      const insideCandidate =
        globalX >= detection.bounds.x - candidateMargin &&
        globalX <=
          detection.bounds.x + detection.bounds.width + candidateMargin &&
        globalY >= detection.bounds.y - candidateMargin &&
        globalY <=
          detection.bounds.y + detection.bounds.height + candidateMargin;
      const local = y * bounds.width + x;
      if (insideCandidate && residuals[local] >= coreThreshold) {
        core[local] = 255;
        seeded += 1;
      }
    }
  }

  if (seeded < expectedArea * 0.02) {
    const contrastFloor = Math.max(sensitivityFloor, 16);
    for (let y = 0; y < bounds.height; y += 1) {
      for (let x = 0; x < bounds.width; x += 1) {
        const globalX = bounds.x + x;
        const globalY = bounds.y + y;
        const insideCandidate =
          globalX >= detection.bounds.x - candidateMargin &&
          globalX <=
            detection.bounds.x + detection.bounds.width + candidateMargin &&
          globalY >= detection.bounds.y - candidateMargin &&
          globalY <=
            detection.bounds.y + detection.bounds.height + candidateMargin;
        const local = y * bounds.width + x;
        if (!insideCandidate || core[local]) continue;
        const source = offset(globalX, globalY, image.width);
        const observed = [
          image.data[source],
          image.data[source + 1],
          image.data[source + 2],
        ];
        if (
          residuals[local] >= contrastFloor ||
          labDistance(observed, model.flatColor) >= contrastFloor
        ) {
          core[local] = 255;
        }
      }
    }
  }

  core = selectCoreColorClusters(image, bounds, core, residuals);
  core = morph(
    morph(core, bounds.width, bounds.height, 1, "dilate"),
    bounds.width,
    bounds.height,
    1,
    "erode",
  );
  const maxEffectDistance = Math.max(
    2,
    Math.round(detection.bounds.height * 0.32),
  );
  const effects = growEffects(
    core,
    residuals,
    bounds.width,
    weakThreshold,
    maxEffectDistance,
  );
  const automaticExpansion = detection.bounds.height >= 28 ? 1 : 0;
  const removalMask = morph(
    effects,
    bounds.width,
    bounds.height,
    Math.max(options.maskDilation, automaticExpansion),
    "dilate",
  );
  const effectMask = new Uint8Array(size);
  const softMask = new Uint8ClampedArray(size);
  let corePixels = 0;
  let removalPixels = 0;
  for (let index = 0; index < size; index += 1) {
    if (core[index]) corePixels += 1;
    if (effects[index] && !core[index]) effectMask[index] = 255;
    if (removalMask[index]) {
      removalPixels += 1;
      const normalized =
        (residuals[index] - weakThreshold) /
        Math.max(1, coreThreshold - weakThreshold);
      softMask[index] = Math.round(
        255 * clamp(0.82 + normalized * 0.18, 0.82, 1),
      );
    }
  }

  const coverage = corePixels / expectedArea;
  const noisePenalty = noise90 / Math.max(1, coreThreshold);
  const confidence = clamp(
    detection.confidence *
      (coverage > 0.025 && coverage < 0.78 ? 1 : 0.72) *
      (1 - Math.min(0.35, noisePenalty * 0.2)),
    0.2,
    0.99,
  );

  return {
    detection,
    bounds,
    width: bounds.width,
    height: bounds.height,
    coreMask: core,
    effectMask,
    removalMask,
    softMask,
    model,
    textColor: textColorFromMask(image, bounds, core, residuals),
    confidence: removalPixels ? confidence : 0,
  };
};

const medianChannel = (values: number[]) => {
  if (!values.length) return 0;
  const ranked = [...values].sort((left, right) => left - right);
  return ranked[Math.floor((ranked.length - 1) / 2)];
};

const sampleColor = (
  image: ImageData,
  x: number,
  y: number,
): [number, number, number] => {
  const source = offset(x, y, image.width);
  return [image.data[source], image.data[source + 1], image.data[source + 2]];
};

// After a flat/gradient fill, compare the hole to the original ring around the
// glyph - not the post-mask leftovers, which dilation often eats. A plane can
// fit a padded window while the letters sit on texture or a different local
// color; in that case neural inpaint should take over.
export const analyticalFillDisagreesWithRing = (
  image: ImageData,
  segmentation: GlyphSegmentation,
) => {
  const { bounds, removalMask, width, height, model } = segmentation;
  const hole: [number, number, number][] = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const local = y * width + x;
      if (!removalMask[local]) continue;
      hole.push(sampleColor(image, bounds.x + x, bounds.y + y));
    }
  }

  if (hole.length < 4) return false;

  const ringMedian = model.ringMedian;
  const ringSpread = model.ringSpread;
  const holeMedian: [number, number, number] = [
    medianChannel(hole.map((color) => color[0])),
    medianChannel(hole.map((color) => color[1])),
    medianChannel(hole.map((color) => color[2])),
  ];
  const holeMean =
    hole.reduce((sum, color) => sum + labDistance(color, ringMedian), 0) /
    hole.length;
  const holeToRing = labDistance(holeMedian, ringMedian);

  // Checker/photo rings cannot be reconstructed by a single color or plane.
  if (ringSpread >= 14) return true;
  return (
    holeToRing > Math.max(7, ringSpread * 2.2) ||
    holeMean > Math.max(7, ringSpread * 2.2)
  );
};
