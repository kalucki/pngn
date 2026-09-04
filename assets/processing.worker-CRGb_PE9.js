var e=Object.defineProperty,t=(t,n)=>{let r={};for(var i in t)e(r,i,{get:t[i],enumerable:!0});return n||e(r,Symbol.toStringTag,{value:`Module`}),r},n=(e=>typeof require<`u`?require:typeof Proxy<`u`?new Proxy(e,{get:(e,t)=>(typeof require<`u`?require:e)[t]}):e)(function(e){if(typeof require<`u`)return require.apply(this,arguments);throw Error('Calling `require` for "'+e+"\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.")});let r=`https://media.githubusercontent.com/media/PT-Perkasa-Pilar-Utama/ppu-paddle-ocr-models/main`,i={detection:`${r}/detection/ort/PP-OCRv6_tiny_det.ort`,recognition:`${r}/recognition/ort/PP-OCRv6_tiny_rec.ort`,charactersDictionary:`https://raw.githubusercontent.com/PT-Perkasa-Pilar-Utama/ppu-paddle-ocr-models/main/recognition/ppocrv6_tiny_dict.txt`};var a=t({InferenceSession:()=>Ee,TRACE:()=>ve,TRACE_EVENT_BEGIN:()=>xe,TRACE_EVENT_END:()=>Se,TRACE_FUNC_BEGIN:()=>be,TRACE_FUNC_END:()=>N,Tensor:()=>_e,default:()=>Td,env:()=>D,registerBackend:()=>_}),o=Object.defineProperty,s=Object.getOwnPropertyDescriptor,c=Object.getOwnPropertyNames,l=Object.prototype.hasOwnProperty,u=(e=>typeof n<`u`?n:typeof Proxy<`u`?new Proxy(e,{get:(e,t)=>(typeof n<`u`?n:e)[t]}):e)(function(e){
/*!
* ONNX Runtime Web v1.27.0
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License.
*/
if(typeof n<`u`)return n.apply(this,arguments);throw Error(`Dynamic require of "`+e+`" is not supported`)}),d=(e,t)=>()=>(e&&(t=e(e=0)),t),f=(e,t)=>{for(var n in t)o(e,n,{get:t[n],enumerable:!0})},p=(e,t,n,r)=>{if(t&&typeof t==`object`||typeof t==`function`)for(let i of c(t))!l.call(e,i)&&i!==n&&o(e,i,{get:()=>t[i],enumerable:!(r=s(t,i))||r.enumerable});return e},m=e=>p(o({},`__esModule`,{value:!0}),e),h,g,_,v,y,b=d(()=>{h=new Map,g=[],_=(e,t,n)=>{if(t&&typeof t.init==`function`&&typeof t.createInferenceSessionHandler==`function`){let r=h.get(e);if(r===void 0)h.set(e,{backend:t,priority:n});else{if(r.priority>n)return;if(r.priority===n&&r.backend!==t)throw Error(`cannot register backend "${e}" using priority ${n}`)}if(n>=0){let t=g.indexOf(e);t!==-1&&g.splice(t,1);for(let t=0;t<g.length;t++)if(h.get(g[t]).priority<=n){g.splice(t,0,e);return}g.push(e)}return}throw TypeError(`not a valid backend`)},v=async e=>{let t=h.get(e);if(!t)return`backend not found.`;if(t.initialized)return t.backend;if(t.aborted)return t.error;{let n=!!t.initPromise;try{return n||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(e){return n||(t.error=`${e}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},y=async e=>{let t=e.executionProviders||[],n=t.map(e=>typeof e==`string`?e:e.name),r=n.length===0?g:n,i,a=[],o=new Set;for(let e of r){let t=await v(e);typeof t==`string`?a.push({name:e,err:t}):(i||=t,i===t&&o.add(e))}if(!i)throw Error(`no available backend found. ERR: ${a.map(e=>`[${e.name}] ${e.err}`).join(`, `)}`);for(let{name:e,err:t}of a)n.includes(e)&&console.warn(`removing requested execution provider "${e}" from session options because it is not available: ${t}`);let s=t.filter(e=>o.has(typeof e==`string`?e:e.name));return[i,new Proxy(e,{get:(e,t)=>t===`executionProviders`?s:Reflect.get(e,t)})]}}),x=d(()=>{b()}),S,C=d(()=>{S=`1.27.0`}),w,T,E=d(()=>{C(),w=`warning`,T={wasm:{},webgl:{},webgpu:{},versions:{common:S},set logLevel(e){if(e!==void 0){if(typeof e!=`string`||[`verbose`,`info`,`warning`,`error`,`fatal`].indexOf(e)===-1)throw Error(`Unsupported logging level: ${e}`);w=e}},get logLevel(){return w}},Object.defineProperty(T,"logLevel",{enumerable:!0})}),D,O=d(()=>{E(),D=T}),k,A,j=d(()=>{k=(e,t)=>{let n=typeof document<`u`?document.createElement(`canvas`):new OffscreenCanvas(1,1);n.width=e.dims[3],n.height=e.dims[2];let r=n.getContext(`2d`);if(r!=null){let i,a;t?.tensorLayout!==void 0&&t.tensorLayout===`NHWC`?(i=e.dims[2],a=e.dims[3]):(i=e.dims[3],a=e.dims[2]);let o=t?.format===void 0?`RGB`:t.format,s=t?.norm,c,l;s===void 0||s.mean===void 0?c=[255,255,255,255]:typeof s.mean==`number`?c=[s.mean,s.mean,s.mean,s.mean]:(c=[s.mean[0],s.mean[1],s.mean[2],0],s.mean[3]!==void 0&&(c[3]=s.mean[3])),s===void 0||s.bias===void 0?l=[0,0,0,0]:typeof s.bias==`number`?l=[s.bias,s.bias,s.bias,s.bias]:(l=[s.bias[0],s.bias[1],s.bias[2],0],s.bias[3]!==void 0&&(l[3]=s.bias[3]));let u=a*i,d=0,f=u,p=u*2,m=-1;o===`RGBA`?(d=0,f=u,p=u*2,m=u*3):o===`RGB`?(d=0,f=u,p=u*2):o===`RBG`&&(d=0,p=u,f=u*2);for(let t=0;t<a;t++)for(let n=0;n<i;n++){let i=(e.data[d++]-l[0])*c[0],a=(e.data[f++]-l[1])*c[1],o=(e.data[p++]-l[2])*c[2],s=m===-1?255:(e.data[m++]-l[3])*c[3];r.fillStyle=`rgba(`+i+`,`+a+`,`+o+`,`+s+`)`,r.fillRect(n,t,1,1)}if(`toDataURL`in n)return n.toDataURL();throw Error(`toDataURL is not supported`)}throw Error(`Can not access image data`)},A=(e,t)=>{let n=typeof document<`u`?document.createElement(`canvas`).getContext(`2d`):new OffscreenCanvas(1,1).getContext(`2d`),r;if(n!=null){let i,a,o;t?.tensorLayout!==void 0&&t.tensorLayout===`NHWC`?(i=e.dims[2],a=e.dims[1],o=e.dims[3]):(i=e.dims[3],a=e.dims[2],o=e.dims[1]);let s=t!==void 0&&t.format!==void 0?t.format:`RGB`,c=t?.norm,l,u;c===void 0||c.mean===void 0?l=[255,255,255,255]:typeof c.mean==`number`?l=[c.mean,c.mean,c.mean,c.mean]:(l=[c.mean[0],c.mean[1],c.mean[2],255],c.mean[3]!==void 0&&(l[3]=c.mean[3])),c===void 0||c.bias===void 0?u=[0,0,0,0]:typeof c.bias==`number`?u=[c.bias,c.bias,c.bias,c.bias]:(u=[c.bias[0],c.bias[1],c.bias[2],0],c.bias[3]!==void 0&&(u[3]=c.bias[3]));let d=a*i;if(t!==void 0&&(t.format!==void 0&&o===4&&t.format!==`RGBA`||o===3&&t.format!==`RGB`&&t.format!==`BGR`))throw Error(`Tensor format doesn't match input tensor dims`);let f=0,p=1,m=2,h=3,g=0,_=d,v=d*2,y=-1;s===`RGBA`?(g=0,_=d,v=d*2,y=d*3):s===`RGB`?(g=0,_=d,v=d*2):s===`RBG`&&(g=0,v=d,_=d*2),r=n.createImageData(i,a);for(let t=0;t<a*i;f+=4,p+=4,m+=4,h+=4,t++)r.data[f]=(e.data[g++]-u[0])*l[0],r.data[p]=(e.data[_++]-u[1])*l[1],r.data[m]=(e.data[v++]-u[2])*l[2],r.data[h]=y===-1?255:(e.data[y++]-u[3])*l[3]}else throw Error(`Can not access image data`);return r}}),ee,te,ne,re,ie,ae,oe=d(()=>{ge(),ee=(e,t)=>{if(e===void 0)throw Error(`Image buffer must be defined`);if(t.height===void 0||t.width===void 0)throw Error(`Image height and width must be defined`);if(t.tensorLayout===`NHWC`)throw Error(`NHWC Tensor layout is not supported yet`);let{height:n,width:r}=t,i=t.norm??{mean:255,bias:0},a,o;a=typeof i.mean==`number`?[i.mean,i.mean,i.mean,i.mean]:[i.mean[0],i.mean[1],i.mean[2],i.mean[3]??255],o=typeof i.bias==`number`?[i.bias,i.bias,i.bias,i.bias]:[i.bias[0],i.bias[1],i.bias[2],i.bias[3]??0];let s=t.format===void 0?`RGBA`:t.format,c=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:`RGB`,l=n*r,u=c===`RGBA`?new Float32Array(l*4):new Float32Array(l*3),d=4,f=0,p=1,m=2,h=3,g=0,_=l,v=l*2,y=-1;s===`RGB`&&(d=3,f=0,p=1,m=2,h=-1),c===`RGBA`?y=l*3:c===`RBG`?(g=0,v=l,_=l*2):c===`BGR`&&(v=0,_=l,g=l*2);for(let t=0;t<l;t++,f+=d,m+=d,p+=d,h+=d)u[g++]=(e[f]+o[0])/a[0],u[_++]=(e[p]+o[1])/a[1],u[v++]=(e[m]+o[2])/a[2],y!==-1&&h!==-1&&(u[y++]=(e[h]+o[3])/a[3]);return c===`RGBA`?new he(`float32`,u,[1,4,n,r]):new he(`float32`,u,[1,3,n,r])},te=async(e,t)=>{let n=typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement,r=typeof ImageData<`u`&&e instanceof ImageData,i=typeof ImageBitmap<`u`&&e instanceof ImageBitmap,a=typeof e==`string`,o,s=t??{},c=()=>{if(typeof document<`u`)return document.createElement(`canvas`);if(typeof OffscreenCanvas<`u`)return new OffscreenCanvas(1,1);throw Error(`Canvas is not supported`)},l=e=>typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||e instanceof OffscreenCanvas?e.getContext(`2d`):null;if(n){let n=c();n.width=e.width,n.height=e.height;let r=l(n);if(r!=null){let n=e.height,i=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(n=t.resizedHeight,i=t.resizedWidth),t!==void 0){if(s=t,t.tensorFormat!==void 0)throw Error(`Image input config format must be RGBA for HTMLImageElement`);s.tensorFormat=`RGBA`,s.height=n,s.width=i}else s.tensorFormat=`RGBA`,s.height=n,s.width=i;r.drawImage(e,0,0),o=r.getImageData(0,0,i,n).data}else throw Error(`Can not access image data`)}else if(r){let n,r;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(n=t.resizedHeight,r=t.resizedWidth):(n=e.height,r=e.width),t!==void 0&&(s=t),s.format=`RGBA`,s.height=n,s.width=r,t!==void 0){let t=c();t.width=r,t.height=n;let i=l(t);if(i!=null)i.putImageData(e,0,0),o=i.getImageData(0,0,r,n).data;else throw Error(`Can not access image data`)}else o=e.data}else if(i){if(t===void 0)throw Error(`Please provide image config with format for Imagebitmap`);let n=c();n.width=e.width,n.height=e.height;let r=l(n);if(r!=null){let t=e.height,n=e.width;return r.drawImage(e,0,0,n,t),o=r.getImageData(0,0,n,t).data,s.height=t,s.width=n,ee(o,s)}throw Error(`Can not access image data`)}else{if(a)return new Promise((t,n)=>{let r=c(),i=l(r);if(!e||!i)return n();let a=new Image;a.crossOrigin=`Anonymous`,a.src=e,a.onload=()=>{r.width=a.width,r.height=a.height,i.drawImage(a,0,0,r.width,r.height);let e=i.getImageData(0,0,r.width,r.height);s.height=r.height,s.width=r.width,t(ee(e.data,s))}});throw Error(`Input data provided is not supported - aborted tensor creation`)}if(o!==void 0)return ee(o,s);throw Error(`Input data provided is not supported - aborted tensor creation`)},ne=(e,t)=>{let{width:n,height:r,download:i,dispose:a}=t;return new he({location:`texture`,type:`float32`,texture:e,dims:[1,r,n,4],download:i,dispose:a})},re=(e,t)=>{let{dataType:n,dims:r,download:i,dispose:a}=t;return new he({location:`gpu-buffer`,type:n??`float32`,gpuBuffer:e,dims:r,download:i,dispose:a})},ie=(e,t)=>{let{dataType:n,dims:r,download:i,dispose:a}=t;return new he({location:`ml-tensor`,type:n??`float32`,mlTensor:e,dims:r,download:i,dispose:a})},ae=(e,t,n)=>new he({location:`cpu-pinned`,type:e,data:t,dims:n??[t.length]})}),se,ce,le,ue,de=d(()=>{se=new Map([[`float32`,Float32Array],[`uint8`,Uint8Array],[`int8`,Int8Array],[`uint16`,Uint16Array],[`int16`,Int16Array],[`int32`,Int32Array],[`bool`,Uint8Array],[`float64`,Float64Array],[`uint32`,Uint32Array],[`int4`,Uint8Array],[`uint4`,Uint8Array]]),ce=new Map([[Float32Array,`float32`],[Uint8Array,`uint8`],[Int8Array,`int8`],[Uint16Array,`uint16`],[Int16Array,`int16`],[Int32Array,`int32`],[Float64Array,`float64`],[Uint32Array,`uint32`]]),le=!1,ue=()=>{if(!le){le=!0;let e=typeof BigInt64Array<`u`&&BigInt64Array.from,t=typeof BigUint64Array<`u`&&BigUint64Array.from,n=globalThis.Float16Array,r=typeof n<`u`&&n.from;e&&(se.set(`int64`,BigInt64Array),ce.set(BigInt64Array,`int64`)),t&&(se.set(`uint64`,BigUint64Array),ce.set(BigUint64Array,`uint64`)),r?(se.set(`float16`,n),ce.set(n,`float16`)):se.set(`float16`,Uint16Array)}}}),fe,pe,me=d(()=>{ge(),fe=e=>{let t=1;for(let n=0;n<e.length;n++){let r=e[n];if(typeof r!=`number`||!Number.isSafeInteger(r))throw TypeError(`dims[${n}] must be an integer, got: ${r}`);if(r<0)throw RangeError(`dims[${n}] must be a non-negative integer, got: ${r}`);t*=r}return t},pe=(e,t)=>{switch(e.location){case`cpu`:return new he(e.type,e.data,t);case`cpu-pinned`:return new he({location:`cpu-pinned`,data:e.data,type:e.type,dims:t});case`texture`:return new he({location:`texture`,texture:e.texture,type:e.type,dims:t});case`gpu-buffer`:return new he({location:`gpu-buffer`,gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case`ml-tensor`:return new he({location:`ml-tensor`,mlTensor:e.mlTensor,type:e.type,dims:t});default:throw Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),he,ge=d(()=>{j(),oe(),de(),me(),he=class{constructor(e,t,n){ue();let r,i;if(typeof e==`object`&&`location`in e)switch(this.dataLocation=e.location,r=e.type,i=e.dims,e.location){case`cpu-pinned`:{let t=se.get(r);if(!t)throw TypeError(`unsupported type "${r}" to create tensor from pinned buffer`);if(!(e.data instanceof t))throw TypeError(`buffer should be of type ${t.name}`);this.cpuData=e.data;break}case`texture`:if(r!==`float32`)throw TypeError(`unsupported type "${r}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break;case`gpu-buffer`:if(r!==`float32`&&r!==`float16`&&r!==`int32`&&r!==`int64`&&r!==`uint32`&&r!==`uint8`&&r!==`bool`&&r!==`uint4`&&r!==`int4`)throw TypeError(`unsupported type "${r}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break;case`ml-tensor`:if(r!==`float32`&&r!==`float16`&&r!==`int32`&&r!==`int64`&&r!==`uint32`&&r!==`uint64`&&r!==`int8`&&r!==`uint8`&&r!==`bool`&&r!==`uint4`&&r!==`int4`)throw TypeError(`unsupported type "${r}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break;default:throw Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let a,o;if(typeof e==`string`){if(r=e,o=n,e===`string`){if(!Array.isArray(t))throw TypeError(`A string tensor's data must be a string array.`);a=t}else{let n=se.get(e);if(n===void 0)throw TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e===`float16`&&n===Uint16Array||e===`uint4`||e===`int4`)throw TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${n.name} as data.`);a=e===`uint64`||e===`int64`?n.from(t,BigInt):n.from(t)}else if(t instanceof n)a=t;else if(t instanceof Uint8ClampedArray){if(e===`uint8`)a=Uint8Array.from(t);else throw TypeError(`A Uint8ClampedArray tensor's data must be type of uint8`)}else if(e===`float16`&&t instanceof Uint16Array&&n!==Uint16Array)a=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw TypeError(`A ${r} tensor's data must be type of ${n}`)}}else if(o=t,Array.isArray(e)){if(e.length===0)throw TypeError(`Tensor type cannot be inferred from an empty array.`);let t=typeof e[0];if(t===`string`)r=`string`,a=e;else if(t===`boolean`)r=`bool`,a=Uint8Array.from(e);else throw TypeError(`Invalid element type of data array: ${t}.`)}else if(e instanceof Uint8ClampedArray)r=`uint8`,a=Uint8Array.from(e);else{let t=ce.get(e.constructor);if(t===void 0)throw TypeError(`Unsupported type for tensor data: ${e.constructor}.`);r=t,a=e}if(o===void 0)o=[a.length];else if(!Array.isArray(o))throw TypeError(`A tensor's dims must be a number array`);i=o,this.cpuData=a,this.dataLocation=`cpu`}let a=fe(i);if(this.cpuData&&a!==this.cpuData.length&&(r!==`uint4`&&r!==`int4`||Math.ceil(a/2)!==this.cpuData.length))throw Error(`Tensor's size(${a}) does not match data length(${this.cpuData.length}).`);this.type=r,this.dims=i,this.size=a}static async fromImage(e,t){return te(e,t)}static fromTexture(e,t){return ne(e,t)}static fromGpuBuffer(e,t){return re(e,t)}static fromMLTensor(e,t){return ie(e,t)}static fromPinnedBuffer(e,t,n){return ae(e,t,n)}toDataURL(e){return k(this,e)}toImageData(e){return A(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw Error(`The data is not stored as a WebGL texture.`);return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw Error(`The data is not stored as a WebGPU buffer.`);return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw Error(`The data is not stored as a WebNN MLTensor.`);return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case`cpu`:case`cpu-pinned`:return this.data;case`texture`:case`gpu-buffer`:case`ml-tensor`:if(!this.downloader)throw Error(`The current tensor is not created with a specified data downloader.`);if(this.isDownloading)throw Error(`The current tensor is being downloaded.`);try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation=`cpu`,this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}default:throw Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw Error(`The current tensor is being downloaded.`);this.disposer&&=(this.disposer(),void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation=`none`}ensureValid(){if(this.dataLocation===`none`)throw Error(`The tensor is disposed.`)}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw Error(`Cannot reshape a tensor that owns GPU resource.`);return pe(this,e)}}}),_e,M=d(()=>{ge(),_e=he}),ve,ye,be,N,xe,Se,Ce=d(()=>{E(),ve=(e,t)=>{(typeof T.trace>`u`?!T.wasm.trace:!T.trace)||console.timeStamp(`${e}::ORT::${t}`)},ye=(e,t)=>{let n=Error().stack?.split(/\r\n|\r|\n/g)||[],r=!1;for(let i=0;i<n.length;i++){if(r&&!n[i].includes(`TRACE_FUNC`)){let r=`FUNC_${e}::${n[i].trim().split(` `)[1]}`;t&&(r+=`::${t}`),ve(`CPU`,r);return}n[i].includes(`TRACE_FUNC`)&&(r=!0)}},be=e=>{(typeof T.trace>`u`?!T.wasm.trace:!T.trace)||ye(`BEGIN`,e)},N=e=>{(typeof T.trace>`u`?!T.wasm.trace:!T.trace)||ye(`END`,e)},xe=e=>{(typeof T.trace>`u`?!T.wasm.trace:!T.trace)||console.time(`ORT::${e}`)},Se=e=>{(typeof T.trace>`u`?!T.wasm.trace:!T.trace)||console.timeEnd(`ORT::${e}`)}}),we,Te=d(()=>{b(),M(),Ce(),we=class e{constructor(e){this.handler=e}async run(e,t,n){be(),xe(`InferenceSession.run`);let r={},i={};if(typeof e!=`object`||!e||e instanceof _e||Array.isArray(e))throw TypeError(`'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.`);let a=!0;if(typeof t==`object`){if(t===null)throw TypeError(`Unexpected argument[1]: cannot be null.`);if(t instanceof _e)throw TypeError(`'fetches' cannot be a Tensor`);if(Array.isArray(t)){if(t.length===0)throw TypeError(`'fetches' cannot be an empty array.`);a=!1;for(let e of t){if(typeof e!=`string`)throw TypeError(`'fetches' must be a string array or an object.`);if(this.outputNames.indexOf(e)===-1)throw RangeError(`'fetches' contains invalid output name: ${e}.`);r[e]=null}if(typeof n==`object`&&n)i=n;else if(typeof n<`u`)throw TypeError(`'options' must be an object.`)}else{let e=!1,o=Object.getOwnPropertyNames(t);for(let n of this.outputNames)if(o.indexOf(n)!==-1){let i=t[n];(i===null||i instanceof _e)&&(e=!0,a=!1,r[n]=i)}if(e){if(typeof n==`object`&&n)i=n;else if(typeof n<`u`)throw TypeError(`'options' must be an object.`)}else i=t}}else if(typeof t<`u`)throw TypeError(`Unexpected argument[1]: must be 'fetches' or 'options'.`);for(let t of this.inputNames)if(typeof e[t]>`u`)throw Error(`input '${t}' is missing in 'feeds'.`);if(a)for(let e of this.outputNames)r[e]=null;let o=await this.handler.run(e,r,i),s={};for(let e in o)if(Object.hasOwnProperty.call(o,e)){let t=o[e];s[e]=t instanceof _e?t:new _e(t.type,t.data,t.dims)}return Se(`InferenceSession.run`),N(),s}async release(){return this.handler.dispose()}static async create(t,n,r,i){be(),xe(`InferenceSession.create`);let a,o={};if(typeof t==`string`){if(a=t,typeof n==`object`&&n)o=n;else if(typeof n<`u`)throw TypeError(`'options' must be an object.`)}else if(t instanceof Uint8Array){if(a=t,typeof n==`object`&&n)o=n;else if(typeof n<`u`)throw TypeError(`'options' must be an object.`)}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<`u`&&t instanceof SharedArrayBuffer){let e=t,s=0,c=t.byteLength;if(typeof n==`object`&&n)o=n;else if(typeof n==`number`){if(s=n,!Number.isSafeInteger(s))throw RangeError(`'byteOffset' must be an integer.`);if(s<0||s>=e.byteLength)throw RangeError(`'byteOffset' is out of range [0, ${e.byteLength}).`);if(c=t.byteLength-s,typeof r==`number`){if(c=r,!Number.isSafeInteger(c))throw RangeError(`'byteLength' must be an integer.`);if(c<=0||s+c>e.byteLength)throw RangeError(`'byteLength' is out of range (0, ${e.byteLength-s}].`);if(typeof i==`object`&&i)o=i;else if(typeof i<`u`)throw TypeError(`'options' must be an object.`)}else if(typeof r<`u`)throw TypeError(`'byteLength' must be a number.`)}else if(typeof n<`u`)throw TypeError(`'options' must be an object.`);a=new Uint8Array(e,s,c)}else throw TypeError(`Unexpected argument[0]: must be 'path' or 'buffer'.`);let[s,c]=await y(o),l=await s.createInferenceSessionHandler(a,c);return Se(`InferenceSession.create`),N(),new e(l)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),Ee,De=d(()=>{Te(),Ee=we}),Oe=d(()=>{}),ke=d(()=>{}),Ae=d(()=>{}),je=d(()=>{}),Me={};f(Me,{InferenceSession:()=>Ee,TRACE:()=>ve,TRACE_EVENT_BEGIN:()=>xe,TRACE_EVENT_END:()=>Se,TRACE_FUNC_BEGIN:()=>be,TRACE_FUNC_END:()=>N,Tensor:()=>_e,env:()=>D,registerBackend:()=>_});var Ne=d(()=>{x(),O(),De(),M(),Oe(),ke(),Ce(),Ae(),je()}),Pe=d(()=>{}),Fe={};f(Fe,{default:()=>Re});var Ie,Le,Re,ze=d(()=>{Yu(),pt(),it(),Ie=`ort-wasm-proxy-worker`,Le=globalThis.self?.name===Ie,Le&&(self.onmessage=e=>{let{type:t,in:n}=e.data;try{switch(t){case`init-wasm`:ft(n.wasm).then(()=>{Lu(n).then(()=>{postMessage({type:t})},e=>{postMessage({type:t,err:e})})},e=>{postMessage({type:t,err:e})});break;case`init-ep`:{let{epName:e,env:r}=n;Ru(r,e).then(()=>{postMessage({type:t})},e=>{postMessage({type:t,err:e})});break}case`copy-from`:{let{buffer:e}=n,r=Hu(e);postMessage({type:t,out:r});break}case`create`:{let{model:e,options:r}=n;Uu(e,r).then(e=>{postMessage({type:t,out:e})},e=>{postMessage({type:t,err:e})});break}case`release`:Wu(n),postMessage({type:t});break;case`run`:{let{sessionId:e,inputIndices:r,inputs:i,outputIndices:a,options:o}=n;Ku(e,r,i,a,Array(a.length).fill(null),o).then(e=>{e.some(e=>e[3]!==`cpu`)?postMessage({type:t,err:`Proxy does not support non-cpu tensor location.`}):postMessage({type:t,out:e},Ju([...i,...e]))},e=>{postMessage({type:t,err:e})});break}case`end-profiling`:qu(n),postMessage({type:t})}}catch(e){postMessage({type:t,err:e})}}),Re=Le?null:e=>new Worker(e??Je,{type:`module`,name:Ie})}),Be={};f(Be,{default:()=>He});async function Ve(e={}){var t=e,n=!!globalThis.window,r=!!globalThis.WorkerGlobalScope,i=r&&self.name?.startsWith(`em-pthread`);t.mountExternalData=(e,n)=>{e.startsWith(`./`)&&(e=e.substring(2)),(t.Xc||=new Map).set(e,n)},t.unmountExternalData=()=>{delete t.Xc},globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,shared:!0}).buffer.constructor;let a=e=>async(...n)=>{try{if(t.Yc)throw Error(`Session already started`);let r=t.Yc={Kd:n[0],errors:[]},i=await e(...n);if(t.Yc!==r)throw Error(`Session mismatch`);t.dd?.flush();let a=r.errors;if(0<a.length){let e=await Promise.all(a);if(e=e.filter(e=>e),0<e.length)throw Error(e.join(`
`))}return i}finally{t.Yc=null}};t.jsepInit=(e,n)=>{if(e===`webgpu`){[t.dd,t.Ad,t.Ed,t.ed,t.Dd,t.$b,t.Fd,t.Hd,t.Bd,t.Cd,t.Gd]=n;let e=t.dd;t.jsepRegisterBuffer=(t,n,r,i)=>e.registerBuffer(t,n,r,i),t.jsepGetBuffer=t=>e.getBuffer(t),t.jsepCreateDownloader=(t,n,r)=>e.createDownloader(t,n,r),t.jsepOnCreateSession=t=>{e.onCreateSession(t)},t.jsepOnReleaseSession=t=>{e.onReleaseSession(t)},t.jsepOnRunStart=t=>e.onRunStart(t),t.Id=(t,n)=>{e.upload(t,n)}}else if(e===`webnn`){let e=n[0];[t.Sd,t.sd,t.webnnEnsureTensor,t.td,t.webnnDownloadTensor,t.Rd,t.webnnEnableTraceEvent]=n.slice(1),t.webnnReleaseTensorId=t.sd,t.webnnUploadTensor=t.td,t.webnnRegisterMLContext=t.Rd,t.webnnOnRunStart=t=>e.onRunStart(t),t.webnnOnRunEnd=e.onRunEnd.bind(e),t.webnnOnReleaseSession=t=>{e.onReleaseSession(t)},t.webnnCreateMLTensorDownloader=(t,n)=>e.createMLTensorDownloader(t,n),t.webnnRegisterMLTensor=(t,n,r,i)=>e.registerMLTensor(t,n,r,i),t.webnnCreateMLContext=t=>e.createMLContext(t),t.webnnRegisterMLConstant=(n,r,i,a,o,s)=>e.registerMLConstant(n,r,i,a,o,t.Xc,s),t.webnnRegisterGraphInput=e.registerGraphInput.bind(e),t.webnnIsGraphInput=e.isGraphInput.bind(e),t.webnnRegisterGraphOutput=e.registerGraphOutput.bind(e),t.webnnIsGraphOutput=e.isGraphOutput.bind(e),t.webnnCreateTemporaryTensor=e.createTemporaryTensor.bind(e),t.webnnIsGraphInputOutputTypeSupported=e.isGraphInputOutputTypeSupported.bind(e)}};let o=()=>{let e=e=>(...t)=>{let n=Qt;return t=e(...t),Qt==n?t:new Promise((e,t)=>{on={resolve:e,reject:t}})};(()=>{for(let n of[`_OrtAppendExecutionProvider`,`_OrtCreateSession`,`_OrtRun`,`_OrtRunWithBinding`,`_OrtBindInput`])t[n]=e(t[n])})(),a!==void 0&&(t._OrtRun=a(t._OrtRun),t._OrtRunWithBinding=a(t._OrtRunWithBinding)),o=void 0};t.asyncInit=()=>{o?.()};var s,c,l=(e,t)=>{throw t},u=import.meta.url,d=``;if(n||r){try{d=new URL(`.`,u).href}catch{}r&&(c=e=>{var t=new XMLHttpRequest;return t.open(`GET`,e,!1),t.responseType=`arraybuffer`,t.send(null),new Uint8Array(t.response)}),s=async e=>{if(C(e))return new Promise((t,n)=>{var r=new XMLHttpRequest;r.open(`GET`,e,!0),r.responseType=`arraybuffer`,r.onload=()=>{r.status==200||r.status==0&&r.response?t(r.response):n(r.status)},r.onerror=n,r.send(null)});var t=await fetch(e,{credentials:`same-origin`});if(t.ok)return t.arrayBuffer();throw Error(t.status+` : `+t.url)}}var f,p,m,h,g,_,v=console.log.bind(console),y=console.error.bind(console),b=v,x=y,S=!1,C=e=>e.startsWith(`file://`);function w(){Oe.buffer!=E.buffer&&oe()}if(i){let e=function(n){try{var r=n.data,i=r.Sc;if(i===`load`){let n=[];self.onmessage=e=>n.push(e),_=()=>{postMessage({Sc:`loaded`});for(let t of n)e(t);self.onmessage=e};for(let e of r.xd)t[e]&&!t[e].proxy||(t[e]=(...t)=>{postMessage({Sc:`callHandler`,wd:e,args:t})},e==`print`&&(b=t[e]),e==`printErr`&&(x=t[e]));Oe=r.Od,oe(),p=r.Pd,ue(),na()}else if(i===`run`){(function(e){var t=(w(),j)[e+52>>>2>>>0];e=(w(),j)[e+56>>>2>>>0],Sr(t,t-e),Z(t)})(r.Rc),mr(r.Rc,0,0,1,0,0),Te(),Ut(r.Rc),T||=(ur(),!0);try{ke(r.Md,r.bd)}catch(e){if(e!=`unwind`)throw e}}else r.target!==`setimmediate`&&(i===`checkMailbox`?T&&Wt():i&&(x(`worker: received unknown command ${i}`),x(r)))}catch(e){throw hr(),e}};var T=!1;self.onunhandledrejection=e=>{throw e.reason||e},self.onmessage=e}var E,D,O,k,A,j,ee,te,ne,re,ie,ae=!1;function oe(){var e=Oe.buffer;t.HEAP8=E=new Int8Array(e),O=new Int16Array(e),t.HEAPU8=D=new Uint8Array(e),k=new Uint16Array(e),t.HEAP32=A=new Int32Array(e),t.HEAPU32=j=new Uint32Array(e),ee=new Float32Array(e),te=new Float64Array(e),ne=new BigInt64Array(e),re=new BigUint64Array(e)}function se(){ae=!0,i?_():mi.sb()}function ce(e){throw x(e=`Aborted(`+e+`)`),S=!0,e=new WebAssembly.RuntimeError(e+`. Build with -sASSERTIONS for more info.`),g?.(e),e}function le(){return{a:{ma:vi,gb:_i,g:Me,J:Pe,f:ze,o:Be,h:Ve,ha:He,b:Ue,T:We,Ha:Ke,n:qe,$:Ze,Xa:Qe,Da:$e,Fa:et,Ya:tt,Va:nt,Oa:rt,Ua:it,ka:at,Ea:ot,Ba:st,Wa:ct,Ca:lt,bb:ut,ea:gt,wa:_t,ua:Tt,da:Dt,O:Ot,H:kt,va:Mt,_:zt,xa:Bt,Ra:Vt,za:z,Ia:Kt,sa:qt,fa:Jt,Qa:Ut,_a:B,R:ln,r:gn,c:bt,hb:_n,y:vn,M:yn,D:bn,l:xn,s:Sn,ib:Cn,I:wn,S:Tn,j:V,u:H,q:En,k:Dn,La:U,Ma:kn,Na:An,Ja:jn,Ka:K,ta:J,db:Nn,ab:In,v:Rn,aa:zn,ga:Bn,$a:Pn,W:Vn,Za:Hn,Aa:Un,F:q,U:Wn,la:Yn,ya:Xn,fb:Jn,eb:Zn,Sa:tr,Ta:nr,Ga:be,V:rr,ja:ir,Pa:ar,ia:sr,kb:ea,na:Yi,lb:$i,oa:Ji,G:zi,e:Si,t:bi,w:yi,B:Mi,mb:Gi,K:Ii,x:Ti,pa:Ki,Y:Xi,ba:Wi,nb:Ui,ob:Hi,P:Ni,qa:Vi,pb:Bi,N:Li,Z:qi,d:xi,A:wi,m:Ci,jb:ta,p:Di,z:Oi,C:Ei,E:ki,L:Pi,qb:Ri,Q:Zi,ca:Fi,X:Qi,rb:ji,ra:Ai,i:cr,a:Oe,cb:ve}}}async function ue(){function e(e,n){var r=mi=e.exports;e={};for(let[t,n]of Object.entries(r))typeof n==`function`?(r=Xt(n),e[t]=r):e[t]=n;return mi=e,mi=(function(){var e=mi,t=e=>t=>e(t)>>>0,n=e=>()=>e()>>>0;return(e=Object.assign({},e)).tb=t(e.tb),e.Xb=n(e.Xb),e.Zb=t(e.Zb),e.lc=t(e.lc),e.mc=n(e.mc),e.qc=t(e.qc),e})(),Se.push(mi._b),lr=(e=mi).tb,ur=e.ub,t._OrtInit=e.vb,t._OrtGetLastError=e.wb,t._OrtCreateSessionOptions=e.xb,t._OrtAppendExecutionProvider=e.yb,t._OrtAddFreeDimensionOverride=e.zb,t._OrtAddSessionConfigEntry=e.Ab,t._OrtReleaseSessionOptions=e.Bb,t._OrtCreateSession=e.Cb,t._OrtReleaseSession=e.Db,t._OrtGetInputOutputCount=e.Eb,t._OrtGetInputOutputMetadata=e.Fb,t._OrtFree=e.Gb,t._OrtCreateTensor=e.Hb,t._OrtGetTensorData=e.Ib,t._OrtReleaseTensor=e.Jb,t._OrtCreateRunOptions=e.Kb,t._OrtAddRunConfigEntry=e.Lb,t._OrtReleaseRunOptions=e.Mb,t._OrtCreateBinding=e.Nb,t._OrtBindInput=e.Ob,t._OrtBindOutput=e.Pb,t._OrtClearBoundOutputs=e.Qb,t._OrtReleaseBinding=e.Rb,t._OrtRunWithBinding=e.Sb,t._OrtRun=e.Tb,t._OrtEndProfiling=e.Ub,t._JsepOutput=e.Vb,t._JsepGetNodeName=e.Wb,dr=e.Xb,fr=t._free=e.Yb,pr=t._malloc=e.Zb,mr=e.ac,hr=e.bc,gr=e.cc,_r=e.dc,vr=e.ec,yr=e.fc,br=e.gc,X=e.hc,xr=e.ic,Sr=e.jc,Z=e.kc,Cr=e.lc,Q=e.mc,wr=e.nc,Tr=e.oc,Er=e.pc,Dr=e.qc,Or=e.rc,kr=e.sc,Ar=e.tc,jr=e.uc,Mr=e.vc,Nr=e.wc,Pr=e.xc,Fr=e.yc,Ir=e.zc,Lr=e.Ac,Rr=e.Bc,zr=e.Cc,Br=e.Dc,Vr=e.Ec,Hr=e.Fc,Ur=e.Gc,Wr=e.Hc,Gr=e.Ic,Kr=e.Jc,qr=e.Kc,Jr=e.Lc,Yr=e.Mc,Xr=e.Nc,Zr=e.Pc,Qr=e.Qc,$r=e.$c,ei=e.ad,ti=e.fd,ni=e.jd,ri=e.kd,ii=e.ld,ai=e.md,oi=e.nd,si=e.od,ci=e.pd,$=e.qd,li=e.vd,ui=e.Td,di=e.Ud,fi=e.Vd,pi=e.Wd,p=n,mi}var n,r=le();return t.instantiateWasm?new Promise(n=>{t.instantiateWasm(r,(t,r)=>{n(e(t,r))})}):i?e(new WebAssembly.Instance(p,le()),p):(ie??=t.locateFile?t.locateFile?t.locateFile(`ort-wasm-simd-threaded.jsep.wasm`,d):d+`ort-wasm-simd-threaded.jsep.wasm`:new URL(`/assets/ort-wasm-simd-threaded.jsep-DC5y_g6C.wasm`,``+import.meta.url).href,n=await(async function(e){var t=ie;if(!f&&!C(t))try{var n=fetch(t,{credentials:`same-origin`});return await WebAssembly.instantiateStreaming(n,e)}catch(e){x(`wasm streaming compile failed: ${e}`),x(`falling back to ArrayBuffer instantiation`)}return(async function(e,t){try{var n=await(async function(e){if(!f)try{var t=await s(e);return new Uint8Array(t)}catch{}if(e==ie&&f)e=new Uint8Array(f);else{if(!c)throw`both async and sync fetching of the wasm failed`;e=c(e)}return e})(e);return await WebAssembly.instantiate(n,t)}catch(e){x(`failed to asynchronously prepare wasm: ${e}`),ce(e)}})(t,e)})(r),e(n.instance,n.module))}class de{name=`ExitStatus`;constructor(e){this.message=`Program terminated with exit(${e})`,this.status=e}}var fe=e=>{e.terminate(),e.onmessage=()=>{}},pe=[],me=0,he=null,ge=e=>{N.length==0&&(De(),Ee(N[0]));var t=N.pop();if(!t)return 6;xe.push(t),Ce[e.Rc]=t,t.Rc=e.Rc;var n={Sc:`run`,Md:e.Ld,bd:e.bd,Rc:e.Rc};return t.postMessage(n,e.rd),0},_e=0,M=(e,t,...n)=>{var r,i=16*n.length,a=Q(),o=Cr(i),s=o>>>3;for(r of n)typeof r==`bigint`?((w(),ne)[s++>>>0]=1n,(w(),ne)[s++>>>0]=r):((w(),ne)[s++>>>0]=0n,(w(),te)[s++>>>0]=r);return e=gr(e,0,i,o,t),Z(a),e};function ve(e){if(i)return M(0,1,e);if(m=e,!(0<_e)){for(var t of xe)fe(t);for(t of N)fe(t);N=[],xe=[],Ce={},S=!0}l(0,new de(e))}function ye(e){if(i)return M(1,0,e);be(e)}var be=e=>{if(m=e,i)throw ye(e),`unwind`;ve(e)},N=[],xe=[],Se=[],Ce={},we=e=>{var t=e.Rc;delete Ce[t],N.push(e),xe.splice(xe.indexOf(e),1),e.Rc=0,_r(t)};function Te(){Se.forEach(e=>e())}var Ee=e=>new Promise(n=>{e.onmessage=r=>{var i=r.data;if(r=i.Sc,i.Zc&&i.Zc!=dr()){var a=Ce[i.Zc];a?a.postMessage(i,i.rd):x(`Internal error! Worker sent a message "${r}" to target pthread ${i.Zc}, but that thread no longer exists!`)}else r===`checkMailbox`?Wt():r===`spawnThread`?ge(i):r===`cleanupThread`?R(()=>{we(Ce[i.Nd])}):r===`loaded`?(e.loaded=!0,n(e)):i.target===`setimmediate`?e.postMessage(i):r===`uncaughtException`?e.onerror(i.error):r===`callHandler`?t[i.wd](...i.args):r&&x(`worker sent an unknown command ${r}`)},e.onerror=e=>{throw x(`worker sent an error! ${e.filename}:${e.lineno}: ${e.message}`),e};var r,i=[];for(r of[])t.propertyIsEnumerable(r)&&i.push(r);e.postMessage({Sc:`load`,xd:i,Od:Oe,Pd:p})});function De(){var e=new Worker((()=>{let e=URL;return import.meta.url>`file:`&&import.meta.url<`file;`?new e(`ort.bundle.min.mjs`,import.meta.url):new URL(import.meta.url)})(),{type:`module`,workerData:`em-pthread`,name:`em-pthread`});N.push(e)}var Oe,ke=(e,t)=>{_e=0,e=kr(e,t),0<_e?m=e:vr(e)},Ae=[],je=0;function Me(e){var t=new Le(e>>>=0);return(w(),E)[t.Tc+12>>>0]==0&&(Fe(t,!0),je--),Ie(t,!1),Ae.push(t),Dr(e)}var Ne=0,Pe=()=>{X(0,0);var e=Ae.pop();wr(e.cd),Ne=0};function Fe(e,t){t=+!!t,(w(),E)[e.Tc+12>>>0]=t}function Ie(e,t){t=+!!t,(w(),E)[e.Tc+13>>>0]=t}class Le{constructor(e){this.cd=e,this.Tc=e-24}}var Re=e=>{var t=Ne;if(!t)return xr(0),0;var n=new Le(t);(w(),j)[n.Tc+16>>>2>>>0]=t;var r=(w(),j)[n.Tc+4>>>2>>>0];if(!r)return xr(0),t;for(var i of e){if(i===0||i===r)break;if(Er(i,r,n.Tc+16))return xr(i),t}return xr(r),t};function ze(){return Re([])}function Be(e){return Re([e>>>0])}function Ve(e,t,n,r){return Re([e>>>0,t>>>0,n>>>0,r>>>0])}var He=()=>{var e=Ae.pop();e||ce(`no exception to throw`);var t=e.cd;throw(w(),E)[e.Tc+13>>>0]==0&&(Ae.push(e),Ie(e,!0),Fe(e,!1),je++),Tr(t),Ne=t};function Ue(e,t,n){var r=new Le(e>>>=0);throw t>>>=0,n>>>=0,(w(),j)[r.Tc+16>>>2>>>0]=0,(w(),j)[r.Tc+4>>>2>>>0]=t,(w(),j)[r.Tc+8>>>2>>>0]=n,Tr(e),je++,Ne=e}var We=()=>je;function Ge(e,t,n,r){return i?M(2,1,e,t,n,r):Ke(e,t,n,r)}function Ke(e,t,n,r){if(e>>>=0,t>>>=0,n>>>=0,r>>>=0,!globalThis.SharedArrayBuffer)return 6;var a=[];return i&&a.length===0?Ge(e,t,n,r):(e={Ld:n,Rc:e,bd:r,rd:a},i?(e.Sc=`spawnThread`,postMessage(e,a),0):ge(e))}function qe(e){throw Ne||=e>>>0,Ne}var Je=globalThis.TextDecoder&&new TextDecoder,Ye=(e,t,n,r)=>{if(n=t+n,r)return n;for(;e[t]&&!(t>=n);)++t;return t},Xe=(e,t=0,n,r)=>{if(16<(n=Ye(e,t>>>=0,n,r))-t&&e.buffer&&Je)return Je.decode(e.buffer instanceof ArrayBuffer?e.subarray(t,n):e.slice(t,n));for(r=``;t<n;){var i=e[t++];if(128&i){var a=63&e[t++];if((224&i)==192)r+=String.fromCharCode((31&i)<<6|a);else{var o=63&e[t++];65536>(i=(240&i)==224?(15&i)<<12|a<<6|o:(7&i)<<18|a<<12|o<<6|63&e[t++])?r+=String.fromCharCode(i):(i-=65536,r+=String.fromCharCode(55296|i>>10,56320|1023&i))}}else r+=String.fromCharCode(i)}return r},P=(e,t,n)=>(e>>>=0)?Xe((w(),D),e,t,n):``;function Ze(e,t,n){return i?M(3,1,e,t,n):0}function Qe(e,t){if(i)return M(4,1,e,t)}function $e(e,t){if(i)return M(5,1,e,t)}function et(e,t,n){if(i)return M(6,1,e,t,n)}function tt(e,t,n){return i?M(7,1,e,t,n):0}function nt(e,t){if(i)return M(8,1,e,t)}function rt(e,t,n){if(i)return M(9,1,e,t,n)}function it(e,t,n,r){if(i)return M(10,1,e,t,n,r)}function at(e,t,n,r){if(i)return M(11,1,e,t,n,r)}function ot(e,t,n,r){if(i)return M(12,1,e,t,n,r)}function st(e){if(i)return M(13,1,e)}function ct(e,t){if(i)return M(14,1,e,t)}function lt(e,t,n){if(i)return M(15,1,e,t,n)}var ut=()=>ce(``),dt=e=>{e>>>=0;for(var t=``;;){var n=(w(),D)[e++>>>0];if(!n)return t;t+=String.fromCharCode(n)}},ft={},F={},pt={},mt=class extends Error{constructor(e){super(e),this.name=`BindingError`}};function ht(e,t,n={}){return(function(e,t,n={}){var r=t.name;if(!e)throw new mt(`type "${r}" must have a positive integer typeid pointer`);if(F.hasOwnProperty(e)){if(n.yd)return;throw new mt(`Cannot register type '${r}' twice`)}F[e]=t,delete pt[e],ft.hasOwnProperty(e)&&(t=ft[e],delete ft[e],t.forEach(e=>e()))})(e,t,n)}var I=(e,t,n)=>{switch(t){case 1:return n?e=>(w(),E)[e>>>0]:e=>(w(),D)[e>>>0];case 2:return n?e=>(w(),O)[e>>>1>>>0]:e=>(w(),k)[e>>>1>>>0];case 4:return n?e=>(w(),A)[e>>>2>>>0]:e=>(w(),j)[e>>>2>>>0];case 8:return n?e=>(w(),ne)[e>>>3>>>0]:e=>(w(),re)[e>>>3>>>0];default:throw TypeError(`invalid integer width (${t}): ${e}`)}};function gt(e,t,n,r,i){e>>>=0,n>>>=0,t=dt(t>>>0);let a=e=>e;if(r=r===0n){let e=8*n;a=t=>BigInt.asUintN(e,t),i=a(i)}ht(e,{name:t,Oc:a,Vc:(e,t)=>(typeof t==`number`&&(t=BigInt(t)),t),Uc:I(t,n,!r),Wc:null})}function _t(e,t,n,r){ht(e>>>=0,{name:t=dt(t>>>0),Oc:function(e){return!!e},Vc:function(e,t){return t?n:r},Uc:function(e){return this.Oc((w(),D)[e>>>0])},Wc:null})}var vt=[],yt=[0,1,,1,null,1,!0,1,!1,1];function bt(e){9<(e>>>=0)&&--yt[e+1]===0&&(yt[e]=void 0,vt.push(e))}var xt=e=>{if(!e)throw new mt(`Cannot use deleted val. handle = ${e}`);return yt[e]},St=e=>{switch(e){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let t=vt.pop()||yt.length;return yt[t]=e,yt[t+1]=1,t}};function Ct(e){return this.Oc((w(),j)[e>>>2>>>0])}var wt={name:`emscripten::val`,Oc:e=>{var t=xt(e);return bt(e),t},Vc:(e,t)=>St(t),Uc:Ct,Wc:null};function Tt(e){return ht(e>>>0,wt)}var Et=(e,t)=>{switch(t){case 4:return function(e){return this.Oc((w(),ee)[e>>>2>>>0])};case 8:return function(e){return this.Oc((w(),te)[e>>>3>>>0])};default:throw TypeError(`invalid float width (${t}): ${e}`)}};function Dt(e,t,n){n>>>=0,ht(e>>>=0,{name:t=dt(t>>>0),Oc:e=>e,Vc:(e,t)=>t,Uc:Et(t,n),Wc:null})}function Ot(e,t,n,r,i){e>>>=0,n>>>=0,t=dt(t>>>0);let a=e=>e;if(r===0){var o=32-8*n;a=e=>e<<o>>>o,i=a(i)}ht(e,{name:t,Oc:a,Vc:(e,t)=>t,Uc:I(t,n,r!==0),Wc:null})}function kt(e,t,n){function r(e){var t=(w(),j)[e>>>2>>>0];return e=(w(),j)[e+4>>>2>>>0],new i((w(),E).buffer,e,t)}var i=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][t];ht(e>>>=0,{name:n=dt(n>>>0),Oc:r,Uc:r},{yd:!0})}var At=(e,t,n)=>{var r=(w(),D);if(t>>>=0,0<n){var i=t;n=t+n-1;for(var a=0;a<e.length;++a){var o=e.codePointAt(a);if(127>=o){if(t>=n)break;r[t++>>>0]=o}else if(2047>=o){if(t+1>=n)break;r[t++>>>0]=192|o>>6,r[t++>>>0]=128|63&o}else if(65535>=o){if(t+2>=n)break;r[t++>>>0]=224|o>>12,r[t++>>>0]=128|o>>6&63,r[t++>>>0]=128|63&o}else{if(t+3>=n)break;r[t++>>>0]=240|o>>18,r[t++>>>0]=128|o>>12&63,r[t++>>>0]=128|o>>6&63,r[t++>>>0]=128|63&o,a++}}r[t>>>0]=0,e=t-i}else e=0;return e},jt=e=>{for(var t=0,n=0;n<e.length;++n){var r=e.charCodeAt(n);127>=r?t++:2047>=r?t+=2:55296<=r&&57343>=r?(t+=4,++n):t+=3}return t};function Mt(e,t){ht(e>>>=0,{name:t=dt(t>>>0),Oc(e){var t=(w(),j)[e>>>2>>>0];return t=P(e+4,t,!0),fr(e),t},Vc(e,t){t instanceof ArrayBuffer&&(t=new Uint8Array(t));var n=typeof t==`string`;if(!(n||ArrayBuffer.isView(t)&&t.BYTES_PER_ELEMENT==1))throw new mt(`Cannot pass non-string to std::string`);var r=n?jt(t):t.length,i=pr(4+r+1),a=i+4;return(w(),j)[i>>>2>>>0]=r,n?At(t,a,r+1):(w(),D).set(t,a>>>0),e!==null&&e.push(fr,i),i},Uc:Ct,Wc(e){fr(e)}})}var Nt=globalThis.TextDecoder?new TextDecoder(`utf-16le`):void 0,L=(e,t,n)=>{if(e>>>=1,16<(t=Ye((w(),k),e,t/2,n))-e&&Nt)return Nt.decode((w(),k).slice(e,t));for(n=``;e<t;++e){var r=(w(),k)[e>>>0];n+=String.fromCharCode(r)}return n},Pt=(e,t,n)=>{if(n??=2147483647,2>n)return 0;var r=t;n=(n-=2)<2*e.length?n/2:e.length;for(var i=0;i<n;++i){var a=e.charCodeAt(i);(w(),O)[t>>>1>>>0]=a,t+=2}return(w(),O)[t>>>1>>>0]=0,t-r},Ft=e=>2*e.length,It=(e,t,n)=>{var r=``;e>>>=2;for(var i=0;!(i>=t/4);i++){var a=(w(),j)[e+i>>>0];if(!a&&!n)break;r+=String.fromCodePoint(a)}return r},Lt=(e,t,n)=>{if(t>>>=0,n??=2147483647,4>n)return 0;var r=t;n=r+n-4;for(var i=0;i<e.length;++i){var a=e.codePointAt(i);if(65535<a&&i++,(w(),A)[t>>>2>>>0]=a,(t+=4)+4>n)break}return(w(),A)[t>>>2>>>0]=0,t-r},Rt=e=>{for(var t=0,n=0;n<e.length;++n)65535<e.codePointAt(n)&&n++,t+=4;return t};function zt(e,t,n){if(e>>>=0,t>>>=0,n=dt(n>>>=0),t===2)var r=L,i=Pt,a=Ft;else r=It,i=Lt,a=Rt;ht(e,{name:n,Oc:e=>{var n=(w(),j)[e>>>2>>>0];return n=r(e+4,n*t,!0),fr(e),n},Vc:(e,r)=>{if(typeof r!=`string`)throw new mt(`Cannot pass non-string to C++ string type ${n}`);var o=a(r),s=pr(4+o+t);return(w(),j)[s>>>2>>>0]=o/t,i(r,s+4,o+t),e!==null&&e.push(fr,s),s},Uc:Ct,Wc(e){fr(e)}})}function Bt(e,t){ht(e>>>=0,{zd:!0,name:t=dt(t>>>0),Oc:()=>{},Vc:()=>{}})}function Vt(e){mr(e>>>0,!r,1,!n,131072,!1),Te()}var R=e=>{if(!S)try{if(e(),!(0<_e))try{i?dr()&&vr(m):be(m)}catch(e){e instanceof de||e==`unwind`||l(0,e)}}catch(e){e instanceof de||e==`unwind`||l(0,e)}},Ht=!Atomics.waitAsync||globalThis.navigator?.userAgent&&91>Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)||[])[2]);function Ut(e){e>>>=0,Ht||(Atomics.waitAsync((w(),A),e>>>2,e).value.then(Wt),e+=128,Atomics.store((w(),A),e>>>2,1))}var Wt=()=>R(()=>{var e=dr();e&&(Ut(e),br())});function z(e,t){(e>>>=0)==t>>>0?setTimeout(Wt):i?postMessage({Zc:e,Sc:`checkMailbox`}):(e=Ce[e])&&e.postMessage({Sc:`checkMailbox`})}var Gt=[];function Kt(e,t,n,r,i){for(t>>>=0,i>>>=0,Gt.length=0,n=i>>>3,r=i+r>>>3;n<r;){var a=(w(),ne)[n++>>>0]?(w(),ne)[n++>>>0]:(w(),te)[n++>>>0];Gt.push(a)}return(t?gi[t]:hi[e])(...Gt)}var qt=()=>{_e=0};function Jt(e){e>>>=0,i?postMessage({Sc:`cleanupThread`,Nd:e}):we(Ce[e])}function B(e){}var Yt=e=>{try{e()}catch(e){ce(e)}};function Xt(e){var t=(...t)=>{en.push(e);try{return e(...t)}finally{S||(en.pop(),Qt&&Zt===1&&en.length===0&&(Zt=0,_e+=1,Yt(di),typeof Fibers<`u`&&Fibers.Zd()))}};return rn.set(e,t),t}var Zt=0,Qt=null,$t=0,en=[],tn=new Map,nn=new Map,rn=new Map,an=0,on=null,sn=[],cn=e=>(function(e){if(!S){if(Zt===0){var t=!1,n=!1;e((e=0)=>{if(!S&&($t=e,t=!0,n)){Zt=2,Yt(()=>fi(Qt)),typeof MainLoop<`u`&&MainLoop.ud&&MainLoop.resume(),e=!1;try{var r=(function(){var e=(w(),A)[Qt+8>>>2>>>0];return e=nn.get(e),e=rn.get(e),--_e,e()})()}catch(t){r=t,e=!0}var i=!1;if(!Qt){var a=on;a&&(on=null,(e?a.reject:a.resolve)(r),i=!0)}if(e&&!i)throw r}}),n=!0,t||(Zt=1,Qt=(function(){var e=pr(65548),t=e+12;if((w(),j)[e>>>2>>>0]=t,(w(),j)[e+4>>>2>>>0]=t+65536,t=en[0],!tn.has(t)){var n=an++;tn.set(t,n),nn.set(n,t)}return t=tn.get(t),(w(),A)[e+8>>>2>>>0]=t,e})(),typeof MainLoop<`u`&&MainLoop.ud&&MainLoop.pause(),Yt(()=>ui(Qt)))}else Zt===2?(Zt=0,Yt(pi),fr(Qt),Qt=null,sn.forEach(R)):ce(`invalid state: ${Zt}`);return $t}})(t=>{e().then(t)});function ln(e){return e>>>=0,cn(async()=>St(await xt(e)))}var un=[],dn=e=>{var t=un.length;return un.push(e),t},fn=(e,t)=>{for(var n=Array(e),r=0;r<e;++r){var i=r,a=(w(),j)[t+4*r>>>2>>>0],o=F[a];if(o===void 0)throw e=`parameter ${r}`,a=lr(a),t=dt(a),fr(a),new mt(`${e} has unknown type ${t}`);n[i]=o}return n},pn=(e,t,n)=>{var r=[];return e=e(r,n),r.length&&((w(),j)[t>>>2>>>0]=St(r)),e},mn={},hn=e=>{var t=mn[e];return t===void 0?dt(e):t};function gn(e,t,n){var[r,...i]=fn(e,t>>>0);t=r.Vc.bind(r);var a=i.map(e=>e.Uc.bind(e));e--;var o={toValue:xt};switch(e=a.map((e,t)=>{var n=`argFromPtr${t}`;return o[n]=e,`${n}(args${t?`+`+8*t:``})`}),n){case 0:var s=`toValue(handle)`;break;case 2:s=`new (toValue(handle))`;break;case 3:s=``;break;case 1:o.getStringOrSymbol=hn,s=`toValue(handle)[getStringOrSymbol(methodName)]`}return s+=`(${e})`,r.zd||(o.toReturnWire=t,o.emval_returnValue=pn,s=`return emval_returnValue(toReturnWire, destructorsRef, ${s})`),s=`return function (handle, methodName, destructorsRef, args) {
  ${s}
  }`,n=Function(Object.keys(o),s)(...Object.values(o)),s=`methodCaller<(${i.map(e=>e.name)}) => ${r.name}>`,dn(Object.defineProperty(n,"name",{value:s}))}function _n(e,t){return t>>>=0,(e=xt(e>>>0))==xt(t)}function vn(e){return(e>>>=0)?(e=hn(e),St(globalThis[e])):St(globalThis)}function yn(e){return e=hn(e>>>0),St(t[e])}function bn(e,t){return t>>>=0,e=xt(e>>>0),t=xt(t),St(e[t])}function xn(e){9<(e>>>=0)&&(yt[e+1]+=1)}function Sn(e,t,n,r,i){return un[e>>>0](t>>>0,n>>>0,r>>>0,i>>>0)}function Cn(e,t,n,r,i){return Sn(e>>>0,t>>>0,n>>>0,r>>>0,i>>>0)}function wn(){return St([])}function Tn(e){e=xt(e>>>0);for(var t=Array(e.length),n=0;n<e.length;n++)t[n]=e[n];return St(t)}function V(e){return St(hn(e>>>0))}function H(){return St({})}function En(e){for(var t=xt(e>>>=0);t.length;){var n=t.pop();t.pop()(n)}bt(e)}function Dn(e,t,n){t>>>=0,n>>>=0,e=xt(e>>>0),t=xt(t),n=xt(n),e[t]=n}function U(e,t){e=-9007199254740992>e||9007199254740992<e?NaN:Number(e),t>>>=0,e=new Date(1e3*e),(w(),A)[t>>>2>>>0]=e.getUTCSeconds(),(w(),A)[t+4>>>2>>>0]=e.getUTCMinutes(),(w(),A)[t+8>>>2>>>0]=e.getUTCHours(),(w(),A)[t+12>>>2>>>0]=e.getUTCDate(),(w(),A)[t+16>>>2>>>0]=e.getUTCMonth(),(w(),A)[t+20>>>2>>>0]=e.getUTCFullYear()-1900,(w(),A)[t+24>>>2>>>0]=e.getUTCDay(),e=(e.getTime()-Date.UTC(e.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,(w(),A)[t+28>>>2>>>0]=e}var On=e=>e%4==0&&(e%100!=0||e%400==0),W=[0,31,60,91,121,152,182,213,244,274,305,335],G=[0,31,59,90,120,151,181,212,243,273,304,334];function kn(e,t){e=-9007199254740992>e||9007199254740992<e?NaN:Number(e),t>>>=0,e=new Date(1e3*e),(w(),A)[t>>>2>>>0]=e.getSeconds(),(w(),A)[t+4>>>2>>>0]=e.getMinutes(),(w(),A)[t+8>>>2>>>0]=e.getHours(),(w(),A)[t+12>>>2>>>0]=e.getDate(),(w(),A)[t+16>>>2>>>0]=e.getMonth(),(w(),A)[t+20>>>2>>>0]=e.getFullYear()-1900,(w(),A)[t+24>>>2>>>0]=e.getDay();var n=(On(e.getFullYear())?W:G)[e.getMonth()]+e.getDate()-1|0;(w(),A)[t+28>>>2>>>0]=n,(w(),A)[t+36>>>2>>>0]=-60*e.getTimezoneOffset(),n=new Date(e.getFullYear(),6,1).getTimezoneOffset();var r=new Date(e.getFullYear(),0,1).getTimezoneOffset();e=0|(n!=r&&e.getTimezoneOffset()==Math.min(r,n)),(w(),A)[t+32>>>2>>>0]=e}function An(e){e>>>=0;var t=new Date((w(),A)[e+20>>>2>>>0]+1900,(w(),A)[e+16>>>2>>>0],(w(),A)[e+12>>>2>>>0],(w(),A)[e+8>>>2>>>0],(w(),A)[e+4>>>2>>>0],(w(),A)[e>>>2>>>0],0),n=(w(),A)[e+32>>>2>>>0],r=t.getTimezoneOffset(),i=new Date(t.getFullYear(),6,1).getTimezoneOffset(),a=new Date(t.getFullYear(),0,1).getTimezoneOffset(),o=Math.min(a,i);return 0>n?(w(),A)[e+32>>>2>>>0]=+(i!=a&&o==r):0<n!=(o==r)&&(i=Math.max(a,i),t.setTime(t.getTime()+6e4*((0<n?o:i)-r))),(w(),A)[e+24>>>2>>>0]=t.getDay(),n=(On(t.getFullYear())?W:G)[t.getMonth()]+t.getDate()-1|0,(w(),A)[e+28>>>2>>>0]=n,(w(),A)[e>>>2>>>0]=t.getSeconds(),(w(),A)[e+4>>>2>>>0]=t.getMinutes(),(w(),A)[e+8>>>2>>>0]=t.getHours(),(w(),A)[e+12>>>2>>>0]=t.getDate(),(w(),A)[e+16>>>2>>>0]=t.getMonth(),(w(),A)[e+20>>>2>>>0]=t.getYear(),e=t.getTime(),BigInt(isNaN(e)?-1:e/1e3)}function jn(e,t,n,r,a,o,s){return i?M(16,1,e,t,n,r,a,o,s):-52}function K(e,t,n,r,a,o){if(i)return M(17,1,e,t,n,r,a,o)}var Mn={},q=()=>performance.timeOrigin+performance.now();function J(e,t){return i?M(18,1,e,t):(Mn[e]&&(clearTimeout(Mn[e].id),delete Mn[e]),t&&(Mn[e]={id:setTimeout(()=>{delete Mn[e],R(()=>yr(e,performance.timeOrigin+performance.now()))},t),Yd:t}),0)}function Nn(e,t,n,r){e>>>=0,t>>>=0,n>>>=0,r>>>=0;var i=new Date().getFullYear(),a=new Date(i,0,1).getTimezoneOffset();i=new Date(i,6,1).getTimezoneOffset();var o=Math.max(a,i);(w(),j)[e>>>2>>>0]=60*o,(w(),A)[t>>>2>>>0]=+(a!=i),e=(t=e=>{var t=Math.abs(e);return`UTC${0<=e?`-`:`+`}${String(Math.floor(t/60)).padStart(2,`0`)}${String(t%60).padStart(2,`0`)}`})(a),t=t(i),i<a?(At(e,n,17),At(t,r,17)):(At(e,r,17),At(t,n,17))}var Pn=()=>Date.now(),Fn=1;function In(e,t,n){if(n>>>=0,!(0<=e&&3>=e))return 28;if(e===0)e=Date.now();else{if(!Fn)return 52;e=performance.timeOrigin+performance.now()}return e=Math.round(1e6*e),(w(),ne)[n>>>3>>>0]=BigInt(e),0}var Y=[],Ln=(e,t)=>{Y.length=0;for(var n;n=(w(),D)[e++>>>0];){var r=n!=105;t+=(r&=n!=112)&&t%8?4:0,Y.push(n==112?(w(),j)[t>>>2>>>0]:n==106?(w(),ne)[t>>>3>>>0]:n==105?(w(),A)[t>>>2>>>0]:(w(),te)[t>>>3>>>0]),t+=r?8:4}return Y};function Rn(e,t,n){return e>>>=0,t=Ln(t>>>0,n>>>0),gi[e](...t)}function zn(e,t,n){return e>>>=0,t=Ln(t>>>0,n>>>0),gi[e](...t)}var Bn=()=>{};function Vn(e,t){return x(P(e>>>0,t>>>0))}var Hn=()=>{throw _e+=1,`unwind`};function Un(){return 4294901760}var Wn=()=>navigator.hardwareConcurrency,Gn={},Kn=e=>{var t;return(t=/\bwasm-function\[\d+\]:(0x[0-9a-f]+)/.exec(e))?+t[1]:(t=/:(\d+):\d+(?:\)|$)/.exec(e))?2147483648|t[1]:0},qn=e=>{for(var t of e)(e=Kn(t))&&(Gn[e]=t)};function Jn(){var e=Error().stack.toString().split(`
`);return e[0]==`Error`&&e.shift(),qn(e),Gn.gd=Kn(e[3]),Gn.Jd=e,Gn.gd}function Yn(e){if(!(e=Gn[e>>>0]))return 0;var t;if(t=/^\s+at .*\.wasm\.(.*) \(.*\)$/.exec(e))e=t[1];else if(t=/^\s+at (.*) \(.*\)$/.exec(e))e=t[1];else{if(!(t=/^(.+?)@/.exec(e)))return 0;e=t[1]}fr(Yn.hd??0),t=jt(e)+1;var n=pr(t);return n&&At(e,n,t),Yn.hd=n,Yn.hd}function Xn(e){e>>>=0;var t=(w(),D).length;if(e<=t||4294901760<e)return!1;for(var n=1;4>=n;n*=2){var r=t*(1+.2/n);r=Math.min(r,e+100663296);e:{r=(Math.min(4294901760,65536*Math.ceil(Math.max(e,r)/65536))-Oe.buffer.byteLength+65535)/65536|0;try{Oe.grow(r),oe();var i=1;break e}catch{}i=void 0}if(i)return!0}return!1}function Zn(e,t,n){if(e>>>=0,t>>>=0,Gn.gd==e)var r=Gn.Jd;else(r=Error().stack.toString().split(`
`))[0]==`Error`&&r.shift(),qn(r);for(var i=3;r[i]&&Kn(r[i])!=e;)++i;for(e=0;e<n&&r[e+i];++e)(w(),A)[t+4*e>>>2>>>0]=Kn(r[e+i]);return e}var Qn,$n={},er=()=>{if(!Qn){var e,t={USER:`web_user`,LOGNAME:`web_user`,PATH:`/`,PWD:`/`,HOME:`/home/web_user`,LANG:(globalThis.navigator?.language??`C`).replace(`-`,`_`)+`.UTF-8`,_:`./this.program`};for(e in $n)$n[e]===void 0?delete t[e]:t[e]=$n[e];var n=[];for(e in t)n.push(`${e}=${t[e]}`);Qn=n}return Qn};function tr(e,t){if(i)return M(19,1,e,t);e>>>=0,t>>>=0;var n,r=0,a=0;for(n of er()){var o=t+r;(w(),j)[e+a>>>2>>>0]=o,r+=At(n,o,1/0)+1,a+=4}return 0}function nr(e,t){if(i)return M(20,1,e,t);e>>>=0,t>>>=0;var n=er();for(var r of((w(),j)[e>>>2>>>0]=n.length,e=0,n))e+=jt(r)+1;return(w(),j)[t>>>2>>>0]=e,0}function rr(e){return i?M(21,1,e):52}function ir(e,t,n,r){return i?M(22,1,e,t,n,r):52}function ar(e,t,n,r){return i?M(23,1,e,t,n,r):70}var or=[null,[],[]];function sr(e,t,n,r){if(i)return M(24,1,e,t,n,r);t>>>=0,n>>>=0,r>>>=0;for(var a=0,o=0;o<n;o++){var s=(w(),j)[t>>>2>>>0],c=(w(),j)[t+4>>>2>>>0];t+=8;for(var l=0;l<c;l++){var u=e,d=(w(),D)[s+l>>>0],f=or[u];d===0||d===10?((u===1?b:x)(Xe(f)),f.length=0):f.push(d)}a+=c}return(w(),j)[r>>>2>>>0]=a,0}function cr(e){return e>>>0}i||(function(){for(var e=t.numThreads-1;e--;)De();pe.push(async()=>{var e=(async function(){if(!i)return Promise.all(N.map(Ee))})();me++,await e,--me==0&&he&&(e=he,he=null,e())})})(),i||(Oe=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),oe()),t.wasmBinary&&(f=t.wasmBinary),t.stackSave=()=>Q(),t.stackRestore=e=>Z(e),t.stackAlloc=e=>Cr(e),t.setValue=function(e,t,n=`i8`){switch(n.endsWith(`*`)&&(n=`*`),n){case`i1`:case`i8`:(w(),E)[e>>>0]=t;break;case`i16`:(w(),O)[e>>>1>>>0]=t;break;case`i32`:(w(),A)[e>>>2>>>0]=t;break;case`i64`:(w(),ne)[e>>>3>>>0]=BigInt(t);break;case`float`:(w(),ee)[e>>>2>>>0]=t;break;case`double`:(w(),te)[e>>>3>>>0]=t;break;case`*`:(w(),j)[e>>>2>>>0]=t;break;default:ce(`invalid type for setValue: ${n}`)}},t.getValue=function(e,t=`i8`){switch(t.endsWith(`*`)&&(t=`*`),t){case`i1`:case`i8`:return(w(),E)[e>>>0];case`i16`:return(w(),O)[e>>>1>>>0];case`i32`:return(w(),A)[e>>>2>>>0];case`i64`:return(w(),ne)[e>>>3>>>0];case`float`:return(w(),ee)[e>>>2>>>0];case`double`:return(w(),te)[e>>>3>>>0];case`*`:return(w(),j)[e>>>2>>>0];default:ce(`invalid type for getValue: ${t}`)}},t.UTF8ToString=P,t.stringToUTF8=At,t.lengthBytesUTF8=jt;var lr,ur,dr,fr,pr,mr,hr,gr,_r,vr,yr,br,X,xr,Sr,Z,Cr,Q,wr,Tr,Er,Dr,Or,kr,Ar,jr,Mr,Nr,Pr,Fr,Ir,Lr,Rr,zr,Br,Vr,Hr,Ur,Wr,Gr,Kr,qr,Jr,Yr,Xr,Zr,Qr,$r,ei,ti,ni,ri,ii,ai,oi,si,ci,$,li,ui,di,fi,pi,mi,hi=[ve,ye,Ge,Ze,Qe,$e,et,tt,nt,rt,it,at,ot,st,ct,lt,jn,K,J,tr,nr,rr,ir,ar,sr],gi={1003524:(e,n,r,i,a)=>{if(t===void 0||!t.Xc)return 1;if((e=P(Number(e>>>0))).startsWith(`./`)&&(e=e.substring(2)),!(e=t.Xc.get(e)))return 2;if(n=Number(n>>>0),r=Number(r>>>0),i=Number(i>>>0),n+r>e.byteLength)return 3;try{let o=e.subarray(n,n+r);switch(a){case 0:(w(),D).set(o,i>>>0);break;case 1:t.Qd?t.Qd(i,o):t.Id(i,o);break;default:return 4}return 0}catch{return 4}},1004348:(e,n,r)=>{t.td(e,(w(),D).subarray(n>>>0,n+r>>>0))},1004412:()=>t.Sd(),1004454:e=>{t.sd(e)},1004491:()=>{t.Bd()},1004522:()=>{t.Cd()},1004551:()=>{t.Gd()},1004576:e=>t.Ad(e),1004609:e=>t.Ed(e),1004641:(e,n,r)=>{t.ed(Number(e),Number(n),Number(r),!0)},1004704:(e,n,r)=>{t.ed(Number(e),Number(n),Number(r))},1004761:()=>typeof wasmOffsetConverter<`u`,1004818:e=>{t.$b(`Abs`,e,void 0)},1004869:e=>{t.$b(`Neg`,e,void 0)},1004920:e=>{t.$b(`Floor`,e,void 0)},1004973:e=>{t.$b(`Ceil`,e,void 0)},1005025:e=>{t.$b(`Reciprocal`,e,void 0)},1005083:e=>{t.$b(`Sqrt`,e,void 0)},1005135:e=>{t.$b(`Exp`,e,void 0)},1005186:e=>{t.$b(`Erf`,e,void 0)},1005237:e=>{t.$b(`Sigmoid`,e,void 0)},1005292:(e,n,r)=>{t.$b(`HardSigmoid`,e,{alpha:n,beta:r})},1005371:e=>{t.$b(`Log`,e,void 0)},1005422:e=>{t.$b(`Sin`,e,void 0)},1005473:e=>{t.$b(`Cos`,e,void 0)},1005524:e=>{t.$b(`Tan`,e,void 0)},1005575:e=>{t.$b(`Asin`,e,void 0)},1005627:e=>{t.$b(`Acos`,e,void 0)},1005679:e=>{t.$b(`Atan`,e,void 0)},1005731:e=>{t.$b(`Sinh`,e,void 0)},1005783:e=>{t.$b(`Cosh`,e,void 0)},1005835:e=>{t.$b(`Asinh`,e,void 0)},1005888:e=>{t.$b(`Acosh`,e,void 0)},1005941:e=>{t.$b(`Atanh`,e,void 0)},1005994:e=>{t.$b(`Tanh`,e,void 0)},1006046:e=>{t.$b(`Not`,e,void 0)},1006097:(e,n,r)=>{t.$b(`Clip`,e,{min:n,max:r})},1006166:e=>{t.$b(`Clip`,e,void 0)},1006218:(e,n)=>{t.$b(`Elu`,e,{alpha:n})},1006276:e=>{t.$b(`Gelu`,e,void 0)},1006328:e=>{t.$b(`Relu`,e,void 0)},1006380:(e,n)=>{t.$b(`LeakyRelu`,e,{alpha:n})},1006444:(e,n)=>{t.$b(`ThresholdedRelu`,e,{alpha:n})},1006514:(e,n)=>{t.$b(`Cast`,e,{to:n})},1006572:e=>{t.$b(`Add`,e,void 0)},1006623:e=>{t.$b(`Sub`,e,void 0)},1006674:e=>{t.$b(`Mul`,e,void 0)},1006725:e=>{t.$b(`Div`,e,void 0)},1006776:e=>{t.$b(`Pow`,e,void 0)},1006827:e=>{t.$b(`Equal`,e,void 0)},1006880:e=>{t.$b(`Greater`,e,void 0)},1006935:e=>{t.$b(`GreaterOrEqual`,e,void 0)},1006997:e=>{t.$b(`Less`,e,void 0)},1007049:e=>{t.$b(`LessOrEqual`,e,void 0)},1007108:(e,n,r,i,a)=>{t.$b(`ReduceMean`,e,{keepDims:!!n,noopWithEmptyAxes:!!r,axes:i?Array.from((w(),A).subarray(Number(i)>>>0,Number(a)>>>0)):[]})},1007283:(e,n,r,i,a)=>{t.$b(`ReduceMax`,e,{keepDims:!!n,noopWithEmptyAxes:!!r,axes:i?Array.from((w(),A).subarray(Number(i)>>>0,Number(a)>>>0)):[]})},1007457:(e,n,r,i,a)=>{t.$b(`ReduceMin`,e,{keepDims:!!n,noopWithEmptyAxes:!!r,axes:i?Array.from((w(),A).subarray(Number(i)>>>0,Number(a)>>>0)):[]})},1007631:(e,n,r,i,a)=>{t.$b(`ReduceProd`,e,{keepDims:!!n,noopWithEmptyAxes:!!r,axes:i?Array.from((w(),A).subarray(Number(i)>>>0,Number(a)>>>0)):[]})},1007806:(e,n,r,i,a)=>{t.$b(`ReduceSum`,e,{keepDims:!!n,noopWithEmptyAxes:!!r,axes:i?Array.from((w(),A).subarray(Number(i)>>>0,Number(a)>>>0)):[]})},1007980:(e,n,r,i,a)=>{t.$b(`ReduceL1`,e,{keepDims:!!n,noopWithEmptyAxes:!!r,axes:i?Array.from((w(),A).subarray(Number(i)>>>0,Number(a)>>>0)):[]})},1008153:(e,n,r,i,a)=>{t.$b(`ReduceL2`,e,{keepDims:!!n,noopWithEmptyAxes:!!r,axes:i?Array.from((w(),A).subarray(Number(i)>>>0,Number(a)>>>0)):[]})},1008326:(e,n,r,i,a)=>{t.$b(`ReduceLogSum`,e,{keepDims:!!n,noopWithEmptyAxes:!!r,axes:i?Array.from((w(),A).subarray(Number(i)>>>0,Number(a)>>>0)):[]})},1008503:(e,n,r,i,a)=>{t.$b(`ReduceSumSquare`,e,{keepDims:!!n,noopWithEmptyAxes:!!r,axes:i?Array.from((w(),A).subarray(Number(i)>>>0,Number(a)>>>0)):[]})},1008683:(e,n,r,i,a)=>{t.$b(`ReduceLogSumExp`,e,{keepDims:!!n,noopWithEmptyAxes:!!r,axes:i?Array.from((w(),A).subarray(Number(i)>>>0,Number(a)>>>0)):[]})},1008863:e=>{t.$b(`Where`,e,void 0)},1008916:(e,n,r)=>{t.$b(`Transpose`,e,{perm:n?Array.from((w(),A).subarray(Number(n)>>>0,Number(r)>>>0)):[]})},1009040:(e,n,r,i)=>{t.$b(`DepthToSpace`,e,{blocksize:n,mode:P(r),format:i?`NHWC`:`NCHW`})},1009173:(e,n,r,i)=>{t.$b(`DepthToSpace`,e,{blocksize:n,mode:P(r),format:i?`NHWC`:`NCHW`})},1009306:(e,n,r,i,a,o,s,c,l,u,d,f,p,m,h)=>{t.$b(`ConvTranspose`,e,{format:l?`NHWC`:`NCHW`,autoPad:n,dilations:[r],group:i,kernelShape:[a],pads:[o,s],strides:[c],wIsConst:()=>!!(w(),E)[u>>>0],outputPadding:d?Array.from((w(),A).subarray(Number(d)>>>0,Number(f)>>>0)):[],outputShape:p?Array.from((w(),A).subarray(Number(p)>>>0,Number(m)>>>0)):[],activation:P(h)})},1009739:(e,n,r,i,a,o,s,c,l,u,d,f,p,m)=>{t.$b(`ConvTranspose`,e,{format:c?`NHWC`:`NCHW`,autoPad:n,dilations:Array.from((w(),A).subarray(Number(r)>>>0,(Number(r)>>>0)+2>>>0)),group:i,kernelShape:Array.from((w(),A).subarray(Number(a)>>>0,(Number(a)>>>0)+2>>>0)),pads:Array.from((w(),A).subarray(Number(o)>>>0,(Number(o)>>>0)+4>>>0)),strides:Array.from((w(),A).subarray(Number(s)>>>0,(Number(s)>>>0)+2>>>0)),wIsConst:()=>!!(w(),E)[l>>>0],outputPadding:u?Array.from((w(),A).subarray(Number(u)>>>0,Number(d)>>>0)):[],outputShape:f?Array.from((w(),A).subarray(Number(f)>>>0,Number(p)>>>0)):[],activation:P(m)})},1010400:(e,n,r,i,a,o,s,c,l,u,d,f,p,m,h)=>{t.$b(`ConvTranspose`,e,{format:l?`NHWC`:`NCHW`,autoPad:n,dilations:[r],group:i,kernelShape:[a],pads:[o,s],strides:[c],wIsConst:()=>!!(w(),E)[u>>>0],outputPadding:d?Array.from((w(),A).subarray(Number(d)>>>0,Number(f)>>>0)):[],outputShape:p?Array.from((w(),A).subarray(Number(p)>>>0,Number(m)>>>0)):[],activation:P(h)})},1010833:(e,n,r,i,a,o,s,c,l,u,d,f,p,m)=>{t.$b(`ConvTranspose`,e,{format:c?`NHWC`:`NCHW`,autoPad:n,dilations:Array.from((w(),A).subarray(Number(r)>>>0,(Number(r)>>>0)+2>>>0)),group:i,kernelShape:Array.from((w(),A).subarray(Number(a)>>>0,(Number(a)>>>0)+2>>>0)),pads:Array.from((w(),A).subarray(Number(o)>>>0,(Number(o)>>>0)+4>>>0)),strides:Array.from((w(),A).subarray(Number(s)>>>0,(Number(s)>>>0)+2>>>0)),wIsConst:()=>!!(w(),E)[l>>>0],outputPadding:u?Array.from((w(),A).subarray(Number(u)>>>0,Number(d)>>>0)):[],outputShape:f?Array.from((w(),A).subarray(Number(f)>>>0,Number(p)>>>0)):[],activation:P(m)})},1011494:(e,n)=>{t.$b(`GlobalAveragePool`,e,{format:n?`NHWC`:`NCHW`})},1011585:(e,n,r,i,a,o,s,c,l,u,d,f,p,m)=>{t.$b(`AveragePool`,e,{format:m?`NHWC`:`NCHW`,auto_pad:n,ceil_mode:r,count_include_pad:i,storage_order:a,dilations:o?Array.from((w(),A).subarray(Number(o)>>>0,Number(s)>>>0)):[],kernel_shape:c?Array.from((w(),A).subarray(Number(c)>>>0,Number(l)>>>0)):[],pads:u?Array.from((w(),A).subarray(Number(u)>>>0,Number(d)>>>0)):[],strides:f?Array.from((w(),A).subarray(Number(f)>>>0,Number(p)>>>0)):[]})},1012064:(e,n)=>{t.$b(`GlobalAveragePool`,e,{format:n?`NHWC`:`NCHW`})},1012155:(e,n,r,i,a,o,s,c,l,u,d,f,p,m)=>{t.$b(`AveragePool`,e,{format:m?`NHWC`:`NCHW`,auto_pad:n,ceil_mode:r,count_include_pad:i,storage_order:a,dilations:o?Array.from((w(),A).subarray(Number(o)>>>0,Number(s)>>>0)):[],kernel_shape:c?Array.from((w(),A).subarray(Number(c)>>>0,Number(l)>>>0)):[],pads:u?Array.from((w(),A).subarray(Number(u)>>>0,Number(d)>>>0)):[],strides:f?Array.from((w(),A).subarray(Number(f)>>>0,Number(p)>>>0)):[]})},1012634:(e,n)=>{t.$b(`GlobalMaxPool`,e,{format:n?`NHWC`:`NCHW`})},1012721:(e,n,r,i,a,o,s,c,l,u,d,f,p,m)=>{t.$b(`MaxPool`,e,{format:m?`NHWC`:`NCHW`,auto_pad:n,ceil_mode:r,count_include_pad:i,storage_order:a,dilations:o?Array.from((w(),A).subarray(Number(o)>>>0,Number(s)>>>0)):[],kernel_shape:c?Array.from((w(),A).subarray(Number(c)>>>0,Number(l)>>>0)):[],pads:u?Array.from((w(),A).subarray(Number(u)>>>0,Number(d)>>>0)):[],strides:f?Array.from((w(),A).subarray(Number(f)>>>0,Number(p)>>>0)):[]})},1013196:(e,n)=>{t.$b(`GlobalMaxPool`,e,{format:n?`NHWC`:`NCHW`})},1013283:(e,n,r,i,a,o,s,c,l,u,d,f,p,m)=>{t.$b(`MaxPool`,e,{format:m?`NHWC`:`NCHW`,auto_pad:n,ceil_mode:r,count_include_pad:i,storage_order:a,dilations:o?Array.from((w(),A).subarray(Number(o)>>>0,Number(s)>>>0)):[],kernel_shape:c?Array.from((w(),A).subarray(Number(c)>>>0,Number(l)>>>0)):[],pads:u?Array.from((w(),A).subarray(Number(u)>>>0,Number(d)>>>0)):[],strides:f?Array.from((w(),A).subarray(Number(f)>>>0,Number(p)>>>0)):[]})},1013758:(e,n,r,i,a)=>{t.$b(`Gemm`,e,{alpha:n,beta:r,transA:i,transB:a})},1013862:e=>{t.$b(`MatMul`,e,void 0)},1013916:(e,n,r,i)=>{t.$b(`ArgMax`,e,{keepDims:!!n,selectLastIndex:!!r,axis:i})},1014024:(e,n,r,i)=>{t.$b(`ArgMin`,e,{keepDims:!!n,selectLastIndex:!!r,axis:i})},1014132:(e,n)=>{t.$b(`Softmax`,e,{axis:n})},1014195:(e,n)=>{t.$b(`Concat`,e,{axis:n})},1014255:(e,n,r,i,a)=>{t.$b(`Split`,e,{axis:n,numOutputs:r,splitSizes:i?Array.from((w(),A).subarray(Number(i)>>>0,Number(a)>>>0)):[]})},1014411:e=>{t.$b(`Expand`,e,void 0)},1014465:(e,n)=>{t.$b(`Gather`,e,{axis:Number(n)})},1014536:(e,n)=>{t.$b(`GatherElements`,e,{axis:Number(n)})},1014615:(e,n)=>{t.$b(`GatherND`,e,{batch_dims:Number(n)})},1014694:(e,n,r,i,a,o,s,c,l,u,d)=>{t.$b(`Resize`,e,{antialias:n,axes:r?Array.from((w(),A).subarray(Number(r)>>>0,Number(i)>>>0)):[],coordinateTransformMode:P(a),cubicCoeffA:o,excludeOutside:s,extrapolationValue:c,keepAspectRatioPolicy:P(l),mode:P(u),nearestMode:P(d)})},1015056:(e,n,r,i,a,o,s)=>{t.$b(`Slice`,e,{starts:n?Array.from((w(),A).subarray(Number(n)>>>0,Number(r)>>>0)):[],ends:i?Array.from((w(),A).subarray(Number(i)>>>0,Number(a)>>>0)):[],axes:o?Array.from((w(),A).subarray(Number(o)>>>0,Number(s)>>>0)):[]})},1015320:e=>{t.$b(`Tile`,e,void 0)},1015372:(e,n,r)=>{t.$b(`InstanceNormalization`,e,{epsilon:n,format:r?`NHWC`:`NCHW`})},1015486:(e,n,r)=>{t.$b(`InstanceNormalization`,e,{epsilon:n,format:r?`NHWC`:`NCHW`})},1015600:e=>{t.$b(`Range`,e,void 0)},1015653:(e,n)=>{t.$b(`Einsum`,e,{equation:P(n)})},1015734:(e,n,r,i,a)=>{t.$b(`Pad`,e,{mode:n,value:r,pads:i?Array.from((w(),A).subarray(Number(i)>>>0,Number(a)>>>0)):[]})},1015877:(e,n,r,i,a,o)=>{t.$b(`BatchNormalization`,e,{epsilon:n,momentum:r,spatial:!!a,trainingMode:!!i,format:o?`NHWC`:`NCHW`})},1016046:(e,n,r,i,a,o)=>{t.$b(`BatchNormalization`,e,{epsilon:n,momentum:r,spatial:!!a,trainingMode:!!i,format:o?`NHWC`:`NCHW`})},1016215:(e,n,r)=>{t.$b(`CumSum`,e,{exclusive:Number(n),reverse:Number(r)})},1016312:(e,n,r)=>{t.$b(`DequantizeLinear`,e,{axis:n,blockSize:r})},1016402:(e,n,r,i,a)=>{t.$b(`GridSample`,e,{align_corners:n,mode:P(r),padding_mode:P(i),format:a?`NHWC`:`NCHW`})},1016572:(e,n,r,i,a)=>{t.$b(`GridSample`,e,{align_corners:n,mode:P(r),padding_mode:P(i),format:a?`NHWC`:`NCHW`})},1016742:(e,n)=>{t.$b(`ScatterND`,e,{reduction:P(n)})},1016827:(e,n,r,i,a,o,s,c,l)=>{t.$b(`Attention`,e,{numHeads:n,isUnidirectional:r,maskFilterValue:i,scale:a,doRotary:o,qkvHiddenSizes:s?Array.from((w(),A).subarray(Number(c)>>>0,Number(c)+s>>>0)):[],pastPresentShareBuffer:!!l})},1017099:e=>{t.$b(`BiasAdd`,e,void 0)},1017154:e=>{t.$b(`BiasSplitGelu`,e,void 0)},1017215:e=>{t.$b(`FastGelu`,e,void 0)},1017271:(e,n,r,i,a,o,s,c,l,u,d,f,p,m,h,g)=>{t.$b(`Conv`,e,{format:f?`NHWC`:`NCHW`,auto_pad:n,dilations:r?Array.from((w(),A).subarray(Number(r)>>>0,Number(i)>>>0)):[],group:a,kernel_shape:o?Array.from((w(),A).subarray(Number(o)>>>0,Number(s)>>>0)):[],pads:c?Array.from((w(),A).subarray(Number(c)>>>0,Number(l)>>>0)):[],strides:u?Array.from((w(),A).subarray(Number(u)>>>0,Number(d)>>>0)):[],w_is_const:()=>!!(w(),E)[Number(p)>>>0],activation:P(m),activation_params:h?Array.from((w(),ee).subarray(Number(h)>>>0,Number(g)>>>0)):[]})},1017855:e=>{t.$b(`Gelu`,e,void 0)},1017907:(e,n,r,i,a,o,s,c,l)=>{t.$b(`GroupQueryAttention`,e,{numHeads:n,kvNumHeads:r,scale:i,softcap:a,doRotary:o,rotaryInterleaved:s,smoothSoftmax:c,localWindowSize:l})},1018124:(e,n,r,i)=>{t.$b(`LayerNormalization`,e,{axis:n,epsilon:r,simplified:!!i})},1018235:(e,n,r,i)=>{t.$b(`LayerNormalization`,e,{axis:n,epsilon:r,simplified:!!i})},1018346:(e,n,r,i,a,o)=>{t.$b(`MatMulNBits`,e,{k:n,n:r,accuracyLevel:i,bits:a,blockSize:o})},1018473:(e,n,r,i,a,o)=>{t.$b(`MultiHeadAttention`,e,{numHeads:n,isUnidirectional:r,maskFilterValue:i,scale:a,doRotary:o})},1018632:(e,n)=>{t.$b(`QuickGelu`,e,{alpha:n})},1018696:(e,n,r,i,a)=>{t.$b(`RotaryEmbedding`,e,{interleaved:!!n,numHeads:r,rotaryEmbeddingDim:i,scale:a})},1018835:(e,n,r)=>{t.$b(`SkipLayerNormalization`,e,{epsilon:n,simplified:!!r})},1018937:(e,n,r)=>{t.$b(`SkipLayerNormalization`,e,{epsilon:n,simplified:!!r})},1019039:(e,n,r,i)=>{t.$b(`GatherBlockQuantized`,e,{gatherAxis:n,quantizeAxis:r,blockSize:i})},1019160:e=>{t.Fd(e)},1019194:(e,n)=>t.Hd(Number(e),Number(n),t.Yc.Kd,t.Yc.errors)};function _i(e,n,r){return cn(async()=>{await t.Dd(Number(e),Number(n),Number(r))})}function vi(){return typeof wasmOffsetConverter<`u`}function yi(e,t,n,r){var i=Q();try{return Lr(e,t,n,r)}catch(e){if(Z(i),e!==e+0)throw e;X(1,0)}}function bi(e,t,n){var r=Q();try{return Nr(e,t,n)}catch(e){if(Z(r),e!==e+0)throw e;X(1,0)}}function xi(e){var t=Q();try{Ar(e)}catch(e){if(Z(t),e!==e+0)throw e;X(1,0)}}function Si(e,t){var n=Q();try{return kr(e,t)}catch(e){if(Z(n),e!==e+0)throw e;X(1,0)}}function Ci(e,t,n){var r=Q();try{Or(e,t,n)}catch(e){if(Z(r),e!==e+0)throw e;X(1,0)}}function wi(e,t){var n=Q();try{Rr(e,t)}catch(e){if(Z(n),e!==e+0)throw e;X(1,0)}}function Ti(e,t,n,r,i,a,o){var s=Q();try{return Fr(e,t,n,r,i,a,o)}catch(e){if(Z(s),e!==e+0)throw e;X(1,0)}}function Ei(e,t,n,r,i,a){var o=Q();try{jr(e,t,n,r,i,a)}catch(e){if(Z(o),e!==e+0)throw e;X(1,0)}}function Di(e,t,n,r){var i=Q();try{Ir(e,t,n,r)}catch(e){if(Z(i),e!==e+0)throw e;X(1,0)}}function Oi(e,t,n,r,i){var a=Q();try{Mr(e,t,n,r,i)}catch(e){if(Z(a),e!==e+0)throw e;X(1,0)}}function ki(e,t,n,r,i,a,o){var s=Q();try{Br(e,t,n,r,i,a,o)}catch(e){if(Z(s),e!==e+0)throw e;X(1,0)}}function Ai(e,t,n,r,i,a,o){var s=Q();try{Vr(e,t,n,r,i,a,o)}catch(e){if(Z(s),e!==e+0)throw e;X(1,0)}}function ji(e,t,n,r,i,a,o,s){var c=Q();try{Gr(e,t,n,r,i,a,o,s)}catch(e){if(Z(c),e!==e+0)throw e;X(1,0)}}function Mi(e,t,n,r,i){var a=Q();try{return zr(e,t,n,r,i)}catch(e){if(Z(a),e!==e+0)throw e;X(1,0)}}function Ni(e,t,n){var r=Q();try{return Kr(e,t,n)}catch(e){if(Z(r),e!==e+0)throw e;X(1,0)}}function Pi(e,t,n,r,i,a,o,s){var c=Q();try{qr(e,t,n,r,i,a,o,s)}catch(e){if(Z(c),e!==e+0)throw e;X(1,0)}}function Fi(e,t,n,r,i,a,o,s,c,l,u,d){var f=Q();try{Hr(e,t,n,r,i,a,o,s,c,l,u,d)}catch(e){if(Z(f),e!==e+0)throw e;X(1,0)}}function Ii(e,t,n,r,i,a){var o=Q();try{return Ur(e,t,n,r,i,a)}catch(e){if(Z(o),e!==e+0)throw e;X(1,0)}}function Li(e,t,n){var r=Q();try{return Jr(e,t,n)}catch(e){if(Z(r),e!==e+0)throw e;return X(1,0),0n}}function Ri(e,t,n,r,i,a,o,s,c){var l=Q();try{Pr(e,t,n,r,i,a,o,s,c)}catch(e){if(Z(l),e!==e+0)throw e;X(1,0)}}function zi(e){var t=Q();try{return Yr(e)}catch(e){if(Z(t),e!==e+0)throw e;X(1,0)}}function Bi(e,t){var n=Q();try{return li(e,t)}catch(e){if(Z(n),e!==e+0)throw e;return X(1,0),0n}}function Vi(e){var t=Q();try{return Xr(e)}catch(e){if(Z(t),e!==e+0)throw e;return X(1,0),0n}}function Hi(e,t,n,r){var i=Q();try{return ni(e,t,n,r)}catch(e){if(Z(i),e!==e+0)throw e;X(1,0)}}function Ui(e,t,n,r,i){var a=Q();try{return ri(e,t,n,r,i)}catch(e){if(Z(a),e!==e+0)throw e;X(1,0)}}function Wi(e,t,n,r,i,a){var o=Q();try{return ii(e,t,n,r,i,a)}catch(e){if(Z(o),e!==e+0)throw e;X(1,0)}}function Gi(e,t,n,r,i,a){var o=Q();try{return ai(e,t,n,r,i,a)}catch(e){if(Z(o),e!==e+0)throw e;X(1,0)}}function Ki(e,t,n,r,i,a,o,s){var c=Q();try{return Wr(e,t,n,r,i,a,o,s)}catch(e){if(Z(c),e!==e+0)throw e;X(1,0)}}function qi(e,t,n,r,i){var a=Q();try{return oi(e,t,n,r,i)}catch(e){if(Z(a),e!==e+0)throw e;return X(1,0),0n}}function Ji(e,t,n,r){var i=Q();try{return si(e,t,n,r)}catch(e){if(Z(i),e!==e+0)throw e;X(1,0)}}function Yi(e,t,n,r){var i=Q();try{return ci(e,t,n,r)}catch(e){if(Z(i),e!==e+0)throw e;X(1,0)}}function Xi(e,t,n,r,i,a,o,s,c,l,u,d){var f=Q();try{return $(e,t,n,r,i,a,o,s,c,l,u,d)}catch(e){if(Z(f),e!==e+0)throw e;X(1,0)}}function Zi(e,t,n,r,i,a,o,s,c,l,u){var d=Q();try{ei(e,t,n,r,i,a,o,s,c,l,u)}catch(e){if(Z(d),e!==e+0)throw e;X(1,0)}}function Qi(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){var g=Q();try{ti(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}catch(e){if(Z(g),e!==e+0)throw e;X(1,0)}}function $i(e,t,n){var r=Q();try{return Zr(e,t,n)}catch(e){if(Z(r),e!==e+0)throw e;X(1,0)}}function ea(e,t,n){var r=Q();try{return Qr(e,t,n)}catch(e){if(Z(r),e!==e+0)throw e;X(1,0)}}function ta(e,t,n,r){var i=Q();try{$r(e,t,n,r)}catch(e){if(Z(i),e!==e+0)throw e;X(1,0)}}function na(){if(0<me)he=na;else if(i)h?.(t),se();else{for(var e=pe;0<e.length;)e.shift()(t);0<me?he=na:(t.calledRun=!0,S||(se(),h?.(t)))}}return i||(mi=await ue(),na()),t.PTR_SIZE=4,ae?t:new Promise((e,t)=>{h=e,g=t})}var He,Ue,We=d(()=>{He=Ve,Ue=globalThis.self?.name?.startsWith(`em-pthread`),Ue&&Ve()}),Ge,Ke,qe,Je,Ye,Xe,P,Ze,Qe,$e,et,tt,nt,rt,it=d(()=>{Pe(),Ge=typeof location>`u`?void 0:location.origin,Ke=import.meta.url>`file:`&&import.meta.url<`file;`,qe=()=>Ke?new URL(new URL(`ort.bundle.min.mjs`,import.meta.url).href,Ge).href:import.meta.url,Je=qe(),Ye=()=>{if(Je&&!Je.startsWith(`blob:`))return Je.substring(0,Je.lastIndexOf(`/`)+1)},Xe=(e,t)=>{try{let n=t??Je;return(n?new URL(e,n):new URL(e)).origin===Ge}catch{return!1}},P=(e,t)=>{let n=t??Je;try{return(n?new URL(e,n):new URL(e)).href}catch{return}},Ze=(e,t)=>`${t??`./`}${e}`,Qe=async e=>{let t=await(await fetch(e,{credentials:`same-origin`})).blob();return URL.createObjectURL(t)},$e=async e=>(await import(e)).default,et=(ze(),m(Fe)).default,tt=async()=>{if(!Je)throw Error(`Failed to load proxy worker: cannot determine the script source URL.`);if(Xe(Je))return[void 0,et()];let e=await Qe(Je);return[e,et(e)]},nt=(We(),m(Be)).default,rt=async(e,t,n,r)=>{let i=nt&&!(e||t);if(i){if(Je)i=Xe(Je)||r&&!n;else if(r&&!n)i=!0;else throw Error(`cannot determine the script source URL.`)}if(i)return[void 0,nt];{let r=`ort-wasm-simd-threaded.jsep.mjs`,i=e??P(r,t),a=n&&i&&!Xe(i,t),o=a?await Qe(i):i??Ze(r,t);return[a?o:void 0,await $e(o)]}}}),at,ot,st,ct,lt,ut,dt,ft,F,pt=d(()=>{it(),ot=!1,st=!1,ct=!1,lt=()=>{if(typeof SharedArrayBuffer>`u`)return!1;try{return typeof MessageChannel<`u`&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},ut=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},dt=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},ft=async e=>{if(ot)return Promise.resolve();if(st)throw Error(`multiple calls to 'initializeWebAssembly()' detected.`);if(ct)throw Error(`previous call to 'initializeWebAssembly()' failed.`);st=!0;let t=e.initTimeout,n=e.numThreads;if(e.simd!==!1){if(e.simd===`relaxed`){if(!dt())throw Error(`Relaxed WebAssembly SIMD is not supported in the current environment.`)}else if(!ut())throw Error(`WebAssembly SIMD is not supported in the current environment.`)}let r=lt();n>1&&!r&&(typeof self<`u`&&!self.crossOriginIsolated&&console.warn(`env.wasm.numThreads is set to `+n+`, but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info.`),console.warn(`WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading.`),e.numThreads=n=1);let i=e.wasmPaths,a=typeof i==`string`?i:void 0,o=i?.mjs,s=o?.href??o,c=i?.wasm,l=c?.href??c,u=e.wasmBinary,[d,f]=await rt(s,a,n>1,!!u||!!l),p=!1,m=[];if(t>0&&m.push(new Promise(e=>{setTimeout(()=>{p=!0,e()},t)})),m.push(new Promise((e,t)=>{let r={numThreads:n};if(u)r.wasmBinary=u,r.locateFile=e=>e;else if(l||a)r.locateFile=e=>l??a+e;else if(s&&s.indexOf(`blob:`)!==0)r.locateFile=e=>new URL(e,s).href;else if(d){let e=Ye();e&&(r.locateFile=t=>e+t)}f(r).then(t=>{st=!1,ot=!0,at=t,e(),d&&URL.revokeObjectURL(d)},e=>{st=!1,ct=!0,t(e)})})),await Promise.race(m),p)throw Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},F=()=>{if(ot&&at)return at;throw Error(`WebAssembly is not initialized yet.`)}}),mt,ht,I,gt=d(()=>{pt(),mt=(e,t)=>{let n=F(),r=n.lengthBytesUTF8(e)+1,i=n._malloc(r);return n.stringToUTF8(e,i,r),t.push(i),i},ht=(e,t,n,r)=>{if(typeof e==`object`&&e){if(n.has(e))throw Error(`Circular reference in options`);n.add(e)}Object.entries(e).forEach(([e,i])=>{let a=t?t+e:e;if(typeof i==`object`)ht(i,a+`.`,n,r);else if(typeof i==`string`||typeof i==`number`)r(a,i.toString());else if(typeof i==`boolean`)r(a,i?`1`:`0`);else throw Error(`Can't handle extra config type: ${typeof i}`)})},I=e=>{let t=F(),n=t.stackSave();try{let n=t.PTR_SIZE,r=t.stackAlloc(2*n);t._OrtGetLastError(r,r+n);let i=Number(t.getValue(r,n===4?`i32`:`i64`)),a=t.getValue(r+n,`*`),o=a?t.UTF8ToString(a):``;throw Error(`${e} ERROR_CODE: ${i}, ERROR_MESSAGE: ${o}`)}finally{t.stackRestore(n)}}}),_t,vt=d(()=>{pt(),gt(),_t=e=>{let t=F(),n=0,r=[],i=e||{};try{if(e?.logSeverityLevel===void 0)i.logSeverityLevel=2;else if(typeof e.logSeverityLevel!=`number`||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw Error(`log severity level is not valid: ${e.logSeverityLevel}`);if(e?.logVerbosityLevel===void 0)i.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!=`number`||!Number.isInteger(e.logVerbosityLevel))throw Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);e?.terminate===void 0&&(i.terminate=!1);let a=0;return e?.tag!==void 0&&(a=mt(e.tag,r)),n=t._OrtCreateRunOptions(i.logSeverityLevel,i.logVerbosityLevel,!!i.terminate,a),n===0&&I(`Can't create run options.`),e?.extra!==void 0&&ht(e.extra,``,new WeakSet,(e,i)=>{let a=mt(e,r),o=mt(i,r);t._OrtAddRunConfigEntry(n,a,o)!==0&&I(`Can't set a run config entry: ${e} - ${i}.`)}),[n,r]}catch(e){throw n!==0&&t._OrtReleaseRunOptions(n),r.forEach(e=>t._free(e)),e}}}),yt,bt,xt,St,Ct,wt,Tt=d(()=>{pt(),gt(),yt=e=>{switch(e){case`disabled`:return 0;case`basic`:return 1;case`extended`:return 2;case`layout`:return 3;case`all`:return 99;default:throw Error(`unsupported graph optimization level: ${e}`)}},bt=e=>{switch(e){case`sequential`:return 0;case`parallel`:return 1;default:throw Error(`unsupported execution mode: ${e}`)}},xt=e=>{e.extra||={},e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||=`1`,e.executionProviders&&e.executionProviders.some(e=>(typeof e==`string`?e:e.name)===`webgpu`)&&(e.enableMemPattern=!1)},St=(e,t,n,r)=>{let i=mt(t,r),a=mt(n,r);F()._OrtAddSessionConfigEntry(e,i,a)!==0&&I(`Can't set a session config entry: ${t} - ${n}.`)},Ct=async(e,t,n)=>{let r=t.executionProviders;for(let t of r){let r=typeof t==`string`?t:t.name,i=[];switch(r){case`webnn`:if(r=`WEBNN`,St(e,`session.disable_quant_qdq`,`1`,n),St(e,`session.disable_qdq_constant_folding`,`1`,n),typeof t!=`string`){let r=t?.deviceType;r&&St(e,`deviceType`,r,n)}break;case`webgpu`:if(r=`JS`,typeof t!=`string`){let r=t;if(r?.preferredLayout){if(r.preferredLayout!==`NCHW`&&r.preferredLayout!==`NHWC`)throw Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${r.preferredLayout}`);St(e,`preferredLayout`,r.preferredLayout,n)}}break;case`wasm`:case`cpu`:continue;default:throw Error(`not supported execution provider: ${r}`)}let a=mt(r,n),o=i.length,s=0,c=0;if(o>0){s=F()._malloc(o*F().PTR_SIZE),n.push(s),c=F()._malloc(o*F().PTR_SIZE),n.push(c);for(let e=0;e<o;e++)F().setValue(s+e*F().PTR_SIZE,i[e][0],`*`),F().setValue(c+e*F().PTR_SIZE,i[e][1],`*`)}await F()._OrtAppendExecutionProvider(e,a,s,c,o)!==0&&I(`Can't append execution provider: ${r}.`)}},wt=async e=>{let t=F(),n=0,r=[],i=e||{};xt(i);try{let e=yt(i.graphOptimizationLevel??`all`),a=bt(i.executionMode??`sequential`),o=typeof i.logId==`string`?mt(i.logId,r):0,s=i.logSeverityLevel??2;if(!Number.isInteger(s)||s<0||s>4)throw Error(`log severity level is not valid: ${s}`);let c=i.logVerbosityLevel??0;if(!Number.isInteger(c)||c<0||c>4)throw Error(`log verbosity level is not valid: ${c}`);let l=typeof i.optimizedModelFilePath==`string`?mt(i.optimizedModelFilePath,r):0;if(n=t._OrtCreateSessionOptions(e,!!i.enableCpuMemArena,!!i.enableMemPattern,a,!!i.enableProfiling,0,o,s,c,l),n===0&&I(`Can't create session options.`),i.executionProviders&&await Ct(n,i,r),i.enableGraphCapture!==void 0){if(typeof i.enableGraphCapture!=`boolean`)throw Error(`enableGraphCapture must be a boolean value: ${i.enableGraphCapture}`);St(n,`enableGraphCapture`,i.enableGraphCapture.toString(),r)}if(i.freeDimensionOverrides)for(let[e,a]of Object.entries(i.freeDimensionOverrides)){if(typeof e!=`string`)throw Error(`free dimension override name must be a string: ${e}`);if(typeof a!=`number`||!Number.isInteger(a)||a<0)throw Error(`free dimension override value must be a non-negative integer: ${a}`);let i=mt(e,r);t._OrtAddFreeDimensionOverride(n,i,a)!==0&&I(`Can't set a free dimension override: ${e} - ${a}.`)}return i.extra!==void 0&&ht(i.extra,``,new WeakSet,(e,t)=>{St(n,e,t,r)}),[n,r]}catch(e){throw n!==0&&t._OrtReleaseSessionOptions(n)!==0&&I(`Can't release session options.`),r.forEach(e=>t._free(e)),e}}}),Et,Dt,Ot,kt,At,jt,Mt,Nt,L=d(()=>{Et=e=>{switch(e){case`int8`:return 3;case`uint8`:return 2;case`bool`:return 9;case`int16`:return 5;case`uint16`:return 4;case`int32`:return 6;case`uint32`:return 12;case`float16`:return 10;case`float32`:return 1;case`float64`:return 11;case`string`:return 8;case`int64`:return 7;case`uint64`:return 13;case`int4`:return 22;case`uint4`:return 21;default:throw Error(`unsupported data type: ${e}`)}},Dt=e=>{switch(e){case 3:return`int8`;case 2:return`uint8`;case 9:return`bool`;case 5:return`int16`;case 4:return`uint16`;case 6:return`int32`;case 12:return`uint32`;case 10:return`float16`;case 1:return`float32`;case 11:return`float64`;case 8:return`string`;case 7:return`int64`;case 13:return`uint64`;case 22:return`int4`;case 21:return`uint4`;default:throw Error(`unsupported data type: ${e}`)}},Ot=(e,t)=>{let n=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],r=typeof t==`number`?t:t.reduce((e,t)=>e*t,1);return n>0?Math.ceil(r*n):void 0},kt=e=>{switch(e){case`float16`:return typeof Float16Array<`u`?Float16Array:Uint16Array;case`float32`:return Float32Array;case`uint8`:return Uint8Array;case`int8`:return Int8Array;case`uint16`:return Uint16Array;case`int16`:return Int16Array;case`int32`:return Int32Array;case`bool`:return Uint8Array;case`float64`:return Float64Array;case`uint32`:return Uint32Array;case`int64`:return BigInt64Array;case`uint64`:return BigUint64Array;default:throw Error(`unsupported type: ${e}`)}},At=e=>{switch(e){case`verbose`:return 0;case`info`:return 1;case`warning`:return 2;case`error`:return 3;case`fatal`:return 4;default:throw Error(`unsupported logging level: ${e}`)}},jt=e=>e===`float32`||e===`float16`||e===`int32`||e===`int64`||e===`uint32`||e===`uint8`||e===`bool`||e===`uint4`||e===`int4`,Mt=e=>e===`float32`||e===`float16`||e===`int32`||e===`int64`||e===`uint32`||e===`uint64`||e===`int8`||e===`uint8`||e===`bool`||e===`uint4`||e===`int4`,Nt=e=>{switch(e){case`none`:return 0;case`cpu`:return 1;case`cpu-pinned`:return 2;case`texture`:return 3;case`gpu-buffer`:return 4;case`ml-tensor`:return 5;default:throw Error(`unsupported data location: ${e}`)}}}),Pt,Ft=d(()=>{Pe(),Pt=async e=>{if(typeof e==`string`){let t=await fetch(e);if(!t.ok)throw Error(`failed to load external data file: ${e}`);let n=t.headers.get(`Content-Length`),r=n?parseInt(n,10):0;if(r<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw Error(`failed to load external data file: ${e}, no response body.`);let n=t.body.getReader(),i;try{i=new ArrayBuffer(r)}catch(e){if(e instanceof RangeError){let e=Math.ceil(r/65536);i=new WebAssembly.Memory({initial:e,maximum:e}).buffer}else throw e}let a=0;for(;;){let{done:e,value:t}=await n.read();if(e)break;let r=t.byteLength;new Uint8Array(i,a,r).set(t),a+=r}return new Uint8Array(i,0,r)}}return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),It,Lt,Rt,zt,Bt,Vt,R,Ht=d(()=>{L(),It=[`V`,`I`,`W`,`E`,`F`],Lt=(e,t)=>{console.log(`[${It[e]},${new Date().toISOString()}]${t}`)},Bt=(e,t)=>{Rt=e,zt=t},Vt=(e,t)=>{let n=At(e);n>=At(Rt)&&Lt(n,typeof t==`function`?t():t)},R=(...e)=>{zt&&Vt(...e)}}),Ut,Wt,z,Gt,Kt,qt,Jt,B=d(()=>{Ut=class{static calcMatMulShape(e,t){return e[1]===t[0]?[e[0],t[1]]:void 0}},Wt=class{static calcShape(e,t,n=!1){let r=e.length,i=t.length;if(r===0)return t;if(i===0)return e;let a=Math.max(e.length,t.length),o=Array(a);if(n){if(r<2||i<2)return;let n=Ut.calcMatMulShape([e[r-2],e[r-1]],[t[i-2],t[i-1]]);if(n===void 0)return;[o[a-2],o[a-1]]=n}for(let s=n?3:1;s<=a;s++){let n=r-s<0?1:e[r-s],c=i-s<0?1:t[i-s];if(n!==c&&n>1&&c>1)return;let l=Math.max(n,c);if(n&&c)o[a-s]=Math.max(n,c);else{if(l>1)return;o[a-s]=0}}return o}static isValidBroadcast(e,t){let n=e.length,r=t.length;if(n>r)return!1;for(let i=1;i<=n;i++)if(e[n-i]!==1&&e[n-i]!==t[r-i])return!1;return!0}},z=class e{static size(t){return e.getSizeFromDimensionRange(t,0,t.length)}static convertShape(e,t=4){let n=e.length;if(n===0)return[];let r=Array(n),i=n-1;for(;i>=0;){if(e[i]%t===0){r[i]=e[i]/t;break}if(t%e[i]!==0)throw Error(`cannot convert shape`);r[i]=1,t/=e[i],i--}for(i--;i>=0;i--)r[i]=e[i];return r}static sizeFromDimension(t,n){if(n<0||n>t.length)throw Error(`invalid dimension of ${n} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return e.getSizeFromDimensionRange(t,n,t.length)}static sizeToDimension(t,n){if(n<0||n>t.length)throw Error(`invalid dimension of ${n} for sizeToDimension as Tensor has ${t.length} dimensions.`);return e.getSizeFromDimensionRange(t,0,n)}static getSizeFromDimensionRange(e,t,n){let r=1;for(let i=t;i<n;i++){if(e[i]<0)throw Error(`cannot get valid size from specified dimension range. Most likely the range contains negative values in them.`);r*=Number(e[i])}return r}static computeStrides(e){let t=e.length;if(t===0)return[];if(t===1)return[1];let n=Array(t);n[t-1]=1,n[t-2]=e[t-1];for(let r=t-3;r>=0;--r)n[r]=n[r+1]*e[r+1];return n}static normalizeAxis(e,t){if(e<-t&&e>=t)throw Error(`unsupported axis for this operation.`);return e<0?e+t:e}static normalizeAxes(e,t){return e.map(n=>this.normalizeAxis(n,t??e.length))}static sortBasedOnPerm(e,t){return t?t.map(t=>e[t]):e.slice().reverse()}static padShape(e,t){let n=e.length;return e.map((e,r)=>e+t[r]+t[r+n])}static areEqual(e,t){return e.length===t.length&&e.every((e,n)=>e===t[n])}},Gt=class e{static adjustPoolAttributes(e,t,n,r,i,a){if(!e&&n.length!==t.length-2)throw Error(`length of specified kernel shapes should be 2 less than length of input dimensions`);if(e)for(let e=0;e<t.length-2;e++)e>=n.length?n.push(t[e+2]):n[e]=t[e+2];for(let e=0;e<n.length;e++)if(e<r.length){if(r[e]<0)throw Error(`strides should be greater than or equal to 1`)}else r.push(1);for(let e=0;e<n.length;e++)if(e<i.length){if(i[e]<0)throw Error(`dilations should be greater than or equal to 1`)}else i.push(1);for(let e=0;e<n.length*2;e++)if(e<a.length){if(a[e]<0)throw Error(`pad should be greater than or equal to 1`)}else a.push(0);for(let e=0;e<n.length;e++){if(n[e]<=0)throw Error(`kernel shapes need to be greater than 0`);if(a[e]>=n[e]||a[e+n.length]>=n[e])throw Error(`pads should be smaller than kernel`)}}static adjustPadsBasedOnAutoPad(t,n,r,i,a,o,s){if(s){if(a.length!==2*(t.length-2))throw Error(`length of pads should be twice the length of data dimensions`);if(n.length!==t.length-2)throw Error(`length of strides should be the length of data dimensions`);if(i.length!==t.length-2)throw Error(`length of kernel shapes should be the length of data dimensions`);for(let c=0;c<t.length-2;c++)e.adjustPadAndReturnShape(t[c+(o?1:2)],n[c],r[c],i[c],a,c,c+t.length-2,s)}}static computePoolOutputShape(t,n,r,i,a,o,s){if(n.length<=0)throw Error(`input shape must be of size greater than 0`);let c=[n[0],n[1]];return e.computeShapeHelper(t,n,c,r,i,a,o,s),c}static computeConvOutputShape(t,n,r,i,a,o,s){if(t.length<=0||n.length<=0)throw Error(`invalid input tensor dims or invalid filter tensor dims`);let c=[t[0],n[0]];return e.computeShapeHelper(!1,t,c,r,i,a,o,s),c}static computeShapeHelper(t,n,r,i,a,o,s,c){if(t)for(let e=0;e<n.length-2;e++)r.push(1);else for(let t=0;t<n.length-2;t++)r.push(e.adjustPadAndReturnShape(n[t+2],i[t],a[t],o[t],s,t,t+n.length-2,c))}static adjustPadAndReturnShape(e,t,n,r,i,a,o,s){let c=n*(r-1)+1;if(s&&s!==`NOTSET`)switch(s){case`VALID`:return i[a]=0,i[o]=0,Math.floor((e-c)/t+1);case`SAME_LOWER`:case`SAME_UPPER`:if(n!==1)throw Error(`Dilation not supported for SAME_UPPER or SAME_LOWER`);{let n=((e+t-1)/t-1)*t+r-e;return i[a]=Math.floor(s===`SAME_LOWER`?(n+1)/2:n/2),i[o]=n-i[a],Math.floor((e+n-r)/t+1)}default:throw Error(`Unsupported AutoPad type`)}else return Math.floor((e+i[a]+i[o]-c)/t+1)}},Kt=class{static getShapeOfGemmResult(e,t,n,r,i){if(e.length!==2||n.length!==2)throw Error(`shape need to be of size 2`);let a,o,s;t?(a=e[1],o=e[0]):(a=e[0],o=e[1]);let c=-1;if(r?(s=n[0],c=1):(s=n[1],c=0),n[c]!==o)throw Error(`dimension mismatch`);if(a<=0||s<=0||o<=0)throw Error(`invalid shape specified`);if(i&&!Wt.isValidBroadcast(i,[a,s]))throw Error(`gemm: invalid bias shape for broadcast`);return[a,s,o]}},qt=-34028234663852886e22,Jt=34028234663852886e22}),Yt,Xt=d(()=>{L(),Yt=(e,t)=>new(kt(t))(e)}),Zt,Qt,$t,en,tn,nn,rn,an,on,sn,cn,ln=d(()=>{L(),Ht(),Zt=new Map([[`float32`,32],[`float16`,16],[`int32`,32],[`uint32`,32],[`int64`,64],[`uint64`,64],[`int8`,8],[`uint8`,8],[`int4`,4],[`uint4`,4]]),Qt=(e,t)=>{if(t===`int32`)return e;let n=Zt.get(t);if(!n)throw Error(`WebNN backend does not support data type: ${t}`);let r=n/8;if(e.byteLength%r!==0)throw Error(`Invalid Uint8Array length - must be a multiple of ${r}.`);let i=e.byteLength/r,a=new(kt(t))(e.buffer,e.byteOffset,i);switch(t){case`int64`:case`uint64`:{let e=new Int32Array(i);for(let t=0;t<i;t++){let n=a[t];if(n>2147483647n||n<-2147483648n)throw Error(`Can not convert int64 data to int32 - value out of range.`);e[t]=Number(n)}return new Uint8Array(e.buffer)}case`int8`:case`uint8`:case`uint32`:{if(t===`uint32`&&a.some(e=>e>2147483647))throw Error(`Can not convert uint32 data to int32 - value out of range.`);let e=Int32Array.from(a,Number);return new Uint8Array(e.buffer)}default:throw Error(`Unsupported data conversion from ${t} to 'int32'`)}},$t=(e,t)=>{if(t===`int32`)return e;if(e.byteLength%4!=0)throw Error(`Invalid Uint8Array length - must be a multiple of 4 (int32).`);let n=e.byteLength/4,r=new Int32Array(e.buffer,e.byteOffset,n);switch(t){case`int64`:{let e=BigInt64Array.from(r,BigInt);return new Uint8Array(e.buffer)}case`uint64`:{if(r.some(e=>e<0))throw Error(`Can not convert int32 data to uin64 - negative value found.`);let e=BigUint64Array.from(r,BigInt);return new Uint8Array(e.buffer)}case`int8`:{if(r.some(e=>e<-128||e>127))throw Error(`Can not convert int32 data to int8 - value out of range.`);let e=Int8Array.from(r,Number);return new Uint8Array(e.buffer)}case`uint8`:if(r.some(e=>e<0||e>255))throw Error(`Can not convert int32 data to uint8 - value out of range.`);return Uint8Array.from(r,Number);case`uint32`:{if(r.some(e=>e<0))throw Error(`Can not convert int32 data to uint32 - negative value found.`);let e=Uint32Array.from(r,Number);return new Uint8Array(e.buffer)}default:throw Error(`Unsupported data conversion from 'int32' to ${t}`)}},en=1,tn=()=>en++,nn=new Map([[`int8`,`int32`],[`uint8`,`int32`],[`uint32`,`int32`],[`int64`,`int32`]]),rn=(e,t)=>{let n=Zt.get(e);if(!n)throw Error(`WebNN backend does not support data type: ${e}`);return t.length>0?Math.ceil(t.reduce((e,t)=>e*t)*n/8):0},an=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:n,tensor:r,dataType:i,shape:a,fallbackDataType:o}=e;this.sessionId=t,this.mlContext=n,this.mlTensor=r,this.dataType=i,this.tensorShape=a,this.fallbackDataType=o}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return rn(this.dataType,this.tensorShape)}destroy(){R(`verbose`,()=>`[WebNN] TensorWrapper.destroy`),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){if(this.fallbackDataType){let t=await this.mlContext.readTensor(this.mlTensor),n=$t(new Uint8Array(t),this.dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(n);return}return new Uint8Array(n).buffer}return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,n){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===n.length&&this.tensorShape.every((e,t)=>e===n[t])}setIsDataConverted(e){this.isDataConverted=e}},on=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,n,r){let i=this.tensorManager.getMLContext(e),a=this.tensorManager.getMLOpSupportLimits(e),o;if(!a?.input.dataTypes.includes(t)){if(o=nn.get(t),!o||a?.input.dataTypes.includes(o))throw Error(`WebNN backend does not support data type: ${t}`);R(`verbose`,()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${o}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(i,t,n))return this.wrapper.tensor;if(r){if(this.wrapper.byteLength!==rn(t,n))throw Error(`Unable to copy data to tensor with different size.`);this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let s=typeof MLTensorUsage>`u`?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,n,s,!0,!0,o),r&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper){if(this.wrapper.fallbackType){if(this.wrapper.fallbackType===`int32`)t=Qt(e,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`)}if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}R(`verbose`,()=>`Data size does not match tensor size. Releasing tensor.`),this.releaseTensor()}this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){if(this.activeUpload){let t=this.wrapper?.isDataConverted?$t(this.activeUpload,this.wrapper?.type):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(t):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(t);return}return t.buffer}if(!this.wrapper)throw Error(`Tensor has not been created.`);return e?this.wrapper.read(e):this.wrapper.read()}},sn=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw Error(`MLContext not found for session.`);return t}getMLOpSupportLimits(e){return this.backend.getMLOpSupportLimits(e)}reserveTensorId(){let e=tn();return this.tensorTrackersById.set(e,new on(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,n,r,i){R(`verbose`,()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${n}, shape: ${r}, copyOld: ${i}}`);let a=this.tensorTrackersById.get(t);if(!a)throw Error(`Tensor not found.`);return a.ensureTensor(e,n,r,i)}upload(e,t){let n=this.tensorTrackersById.get(e);if(!n)throw Error(`Tensor not found.`);n.upload(t)}async download(e,t){R(`verbose`,()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t?.byteLength}}`);let n=this.tensorTrackersById.get(e);if(!n)throw Error(`Tensor not found.`);return n.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,n,r){let i=this.getMLContext(e),a=tn(),o=new an({sessionId:e,context:i,tensor:t,dataType:n,shape:r});return this.tensorTrackersById.set(a,new on(this,o)),this.externalTensors.add(o),a}async getCachedTensor(e,t,n,r,i,a,o){let s=this.getMLContext(e);for(let[r,i]of this.freeTensors.entries())if(i.canReuseTensor(s,t,n)){R(`verbose`,()=>`[WebNN] Reusing tensor {dataType: ${t}, ${o?`fallbackDataType: ${o},`:``} shape: ${n}`);let i=this.freeTensors.splice(r,1)[0];return i.sessionId=e,i}R(`verbose`,()=>`[WebNN] MLContext.createTensor {dataType: ${t}, ${o?`fallbackDataType: ${o},`:``} shape: ${n}}`);let c=await s.createTensor({dataType:o??t,shape:n,dimensions:n,usage:r,writable:i,readable:a});return new an({sessionId:e,context:s,tensor:c,dataType:t,shape:n,fallbackDataType:o})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},cn=(...e)=>new sn(...e)}),un,dn,fn,pn=d(()=>{L(),pt(),Xt(),ln(),Ht(),un=new Map([[1,`float32`],[10,`float16`],[6,`int32`],[12,`uint32`],[7,`int64`],[13,`uint64`],[22,`int4`],[21,`uint4`],[3,`int8`],[2,`uint8`],[9,`uint8`]]),dn=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let n=Object.keys(e).sort(),r=Object.keys(t).sort();return n.length===r.length&&n.every((n,i)=>n===r[i]&&e[n]===t[n])},fn=class{constructor(e){this.tensorManager=cn(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,this.mlOpSupportLimitsBySessionId=new Map,Bt(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw Error(`No active session`);return this.activeSessionId}onRunStart(e){R(`verbose`,()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){R(`verbose`,()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let e of t)R(`verbose`,()=>`[WebNN] releasing temporary tensor {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let t=this.mlContextCache.findIndex(t=>t.gpuDevice===e);if(t!==-1)return this.mlContextCache[t].mlContext;{let t=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:t}),t}}if(e===void 0){let e=this.mlContextCache.findIndex(e=>e.options===void 0&&e.gpuDevice===void 0);if(e!==-1)return this.mlContextCache[e].mlContext;{let e=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:e}),e}}let t=this.mlContextCache.findIndex(t=>dn(t.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let t=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:t}),t}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let n=this.sessionIdsByMLContext.get(t);n||(n=new Set,this.sessionIdsByMLContext.set(t,n)),n.add(e),this.mlOpSupportLimitsBySessionId.has(e)||this.mlOpSupportLimitsBySessionId.set(e,t.opSupportLimits()),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e),this.mlOpSupportLimitsBySessionId.delete(e);let n=this.sessionIdsByMLContext.get(t);if(n.delete(e),n.size===0){this.sessionIdsByMLContext.delete(t);let e=this.mlContextCache.findIndex(e=>e.mlContext===t);e!==-1&&this.mlContextCache.splice(e,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}getMLOpSupportLimits(e){return this.mlOpSupportLimitsBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){R(`verbose`,()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,n,r,i){let a=un.get(n);if(!a)throw Error(`Unsupported ONNX data type: ${n}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,a,r,i)}async createTemporaryTensor(e,t,n){R(`verbose`,()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${n}}`);let r=un.get(t);if(!r)throw Error(`Unsupported ONNX data type: ${t}`);let i=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,i,r,n,!1);let a=this.temporarySessionTensorIds.get(e);return a?a.push(i):this.temporarySessionTensorIds.set(e,[i]),i}uploadTensor(e,t){if(!F().shouldTransferToMLTensor)throw Error(`Trying to upload to a MLTensor while shouldTransferToMLTensor is false`);R(`verbose`,()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let n=await this.tensorManager.download(e);return Yt(n,t)}}registerMLTensor(e,t,n,r){let i=un.get(n);if(!i)throw Error(`Unsupported ONNX data type: ${n}`);let a=this.tensorManager.registerTensor(e,t,i,r);return R(`verbose`,()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${i}, dimensions: ${r}} -> {tensorId: ${a}}`),a}registerMLConstant(e,t,n,r,i,a,o=!1){if(!a)throw Error(`External mounted files are not available.`);let s=e;e.startsWith(`./`)&&(s=e.substring(2));let c=a.get(s);if(!c)throw Error(`File with name ${s} not found in preloaded files.`);if(t+n>c.byteLength)throw Error(`Out of bounds: data offset and length exceed the external file data size.`);let l=c.slice(t,t+n).buffer,u;switch(i.dataType){case`float32`:u=new Float32Array(l);break;case`float16`:u=typeof Float16Array<`u`?new Float16Array(l):new Uint16Array(l);break;case`int32`:u=new Int32Array(l);break;case`uint32`:u=new Uint32Array(l);break;case`int64`:if(o){let e=Qt(new Uint8Array(l),`int64`);u=new Int32Array(e.buffer),i.dataType=`int32`}else u=new BigInt64Array(l);break;case`uint64`:u=new BigUint64Array(l);break;case`int8`:u=new Int8Array(l);break;case`int4`:case`uint4`:case`uint8`:u=new Uint8Array(l);break;default:throw Error(`Unsupported data type: ${i.dataType} in creating WebNN Constant from external data.`)}return R(`verbose`,()=>`[WebNN] registerMLConstant {dataType: ${i.dataType}, shape: ${i.shape}}} ${o?`(Note: it was int64 data type and registered to int32 as workaround)`:``}`),r.constant(i,u)}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.push(e)}isGraphInput(e,t){let n=this.sessionGraphInputs.get(e);return n?n.includes(t):!1}isGraphOutput(e,t){let n=this.sessionGraphOutputs.get(e);return n?n.includes(t):!1}isGraphInputOutputTypeSupported(e,t,n=!0){let r=un.get(Et(t)),i=this.mlOpSupportLimitsBySessionId.get(e);return typeof r>`u`?!1:n?!!i?.input.dataTypes.includes(r):!!i?.output.dataTypes.includes(r)}flush(){}}}),mn=d(()=>{}),hn,gn,_n,vn,yn,bn,xn,Sn,Cn,wn=d(()=>{Ht(),mn(),hn=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),gn=[],_n=e=>Math.ceil(Number(e)/16)*16,vn=e=>{for(let t=0;t<gn.length;t++){let n=gn[t];if(e<=n)return n}return Math.ceil(e/16)*16},yn=1,bn=()=>yn++,xn=async(e,t,n,r)=>{let i=_n(n),a=e.device.createBuffer({size:i,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let o=e.getCommandEncoder();e.endComputePass(),o.copyBufferToBuffer(t,0,a,0,i),e.flush(),await a.mapAsync(GPUMapMode.READ);let s=a.getMappedRange();if(r){let e=r();return e.set(new Uint8Array(s,0,n)),e}return new Uint8Array(s.slice(0,n))}finally{a.destroy()}},Sn=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[e]of hn)gn.push(e),this.freeBuffers.set(e,[]),this.freeUniformBuffers.set(e,[]);this.sessionCount=0}upload(e,t){let n=t.buffer,r=t.byteOffset,i=t.byteLength,a=_n(i),o=this.storageCache.get(e);if(!o)throw Error(`gpu data for uploading does not exist`);if(Number(o.originalSize)!==i)throw Error(`inconsistent data size. gpu data size=${o.originalSize}, data size=${i}`);let s=this.backend.device.createBuffer({mappedAtCreation:!0,size:a,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC}),c=s.getMappedRange();new Uint8Array(c).set(new Uint8Array(n,r,i)),s.unmap();let l=this.backend.device.createCommandEncoder();l.copyBufferToBuffer(s,0,o.gpuData.buffer,0,a),this.backend.device.queue.submit([l.finish()]),s.destroy(),R(`verbose`,()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let n=this.storageCache.get(e);if(!n)throw Error(`source gpu data for memcpy does not exist`);let r=this.storageCache.get(t);if(!r)throw Error(`destination gpu data for memcpy does not exist`);if(n.originalSize!==r.originalSize)throw Error(`inconsistent source and destination gpu data size`);let i=_n(n.originalSize),a=this.backend.getCommandEncoder();this.backend.endComputePass(),a.copyBufferToBuffer(n.gpuData.buffer,0,r.gpuData.buffer,0,i)}registerExternalBuffer(e,t,n){let r;if(n){if(r=n[0],e===n[1])return R(`verbose`,()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${r}, buffer is the same, skip.`),r;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else r=bn();return this.storageCache.set(r,{gpuData:{id:r,type:0,buffer:e},originalSize:t}),R(`verbose`,()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${r}, registered.`),r}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),R(`verbose`,()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let n=vn(e),r,i=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,a=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(i||a){let e=(i?this.freeBuffers:this.freeUniformBuffers).get(n);r=e&&e.length>0?e.pop():this.backend.device.createBuffer({size:n,usage:t})}else r=this.backend.device.createBuffer({size:n,usage:t});let o={id:bn(),type:0,buffer:r};return this.storageCache.set(o.id,{gpuData:o,originalSize:Number(e)}),R(`verbose`,()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${o.id}`),o}get(e){return this.storageCache.get(e)?.gpuData}release(e){let t=typeof e==`bigint`?Number(e):e,n=this.storageCache.get(t);if(!n){if(this.storageCache.size===0)return 0;throw Error(`releasing data does not exist`)}return R(`verbose`,()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${n.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(n.gpuData.buffer),n.originalSize}async download(e,t){let n=this.storageCache.get(Number(e));if(!n)throw Error(`data does not exist`);await xn(this.backend,n.gpuData.buffer,n.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0){if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=hn.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let n=this.freeBuffers.get(e.size)||[];t===void 0||n.length>=t?e.destroy():n.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let n=this.freeUniformBuffers.get(e.size)||[];t===void 0||n.length>=t?e.destroy():n.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(e=>{e.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(e=>{e.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(e=>{e.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(e=>{e.destroy()}),this.capturedPendingBuffers.delete(e)),--this.sessionCount,this.sessionCount===0&&(R(`warning`,()=>`[WebGPU] Clearing webgpu buffer cache`),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.storageCache=new Map)}},Cn=(...e)=>new Sn(...e)}),Tn,V,H=d(()=>{Tn=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(`;`),this.key}},V=e=>new Tn(e)}),En,Dn,U,On,W,G,kn,An,jn,K,Mn,q,J,Nn,Pn,Fn,In,Y=d(()=>{L(),B(),En=64,Dn=(e,t)=>{if(t===3)throw Error(`vec3 has same alignment as vec4, use vec4 instead`);switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:`f16`;case 1:return t>1?`vec${t}<f32>`:`f32`;case 6:return t>1?`vec${t}<i32>`:`i32`;case 12:return t>1?`vec${t}<u32>`:`u32`;case 7:if(t>1)throw Error(`currently not supported vecX of uint64 yet`);return[`vec2<u32>`,`i32`];case 13:if(t>1)throw Error(`currently not supported vecX of uint64 yet`);return[`vec2<u32>`,`u32`];case 9:if(t!==4)throw Error(`bool must be vec4`);return[`u32`,`vec4<bool>`];case 22:return`i32`;case 21:return`u32`;default:throw Error(`Unknown data type: ${e}`)}},U=(e,t=1)=>{let n=Dn(e,t);return typeof n==`string`?n:n[0]},On=(e,t=1)=>{let n=Dn(e,t);return typeof n==`string`?n:n[1]},W=(...e)=>{let t=[];return e.forEach(e=>{e.length!==0&&t.push({type:12,data:e},{type:12,data:z.computeStrides(e)})}),t},G=e=>e%4==0?4:e%2==0?2:1,kn=(e=`f32`,t,n=`0`)=>!t||t===1?`${e}(${n})`:`vec${t}<${e}>(${n})`,An=(e,t,n)=>e===`f32`?n:t===1?`f32(${n})`:`vec${t}<f32>(${n})`,jn=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,K=(e,t,n,r)=>e.startsWith(`uniforms.`)&&n>4?typeof t==`string`?r===`f16`?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:r===`f16`?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:n>1?`${e}[${t}]`:e,Mn=(e,t,n,r,i)=>{let a=typeof n==`number`,o=a?n:n.length,s=[...Array(o).keys()],c=o<2?`u32`:o<=4?`vec${o}<u32>`:`array<u32, ${o}>`,l=Dn(t,i),u=typeof l==`string`?l:l[1],d={indices:c,value:u,storage:typeof l==`string`?l:l[0],tensor:t},f=e=>typeof e==`string`?e:`${e}u`,p={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},m=a?`uniforms.`:``,h=`${m}${e}_shape`,g=`${m}${e}_strides`,_=``;for(let e=0;e<o-1;e++)_+=`
    let dim${e} = current / ${K(g,e,o)};
    let rest${e} = current % ${K(g,e,o)};
    indices[${e}] = dim${e};
    current = rest${e};
    `;_+=`indices[${o-1}] = current;`;let v=o<2?``:`
  fn o2i_${e}(offset: u32) -> ${d.indices} {
    var indices: ${d.indices};
    var current = offset;
    ${_}
    return indices;
  }`,y=t=>(p.offsetToIndices=!0,o<2?t:`o2i_${e}(${t})`),b=[];if(o>=2)for(let e=o-1;e>=0;e--)b.push(`${K(g,e,o)} * (indices[${e}])`);let x=o<2?``:`
  fn i2o_${e}(indices: ${d.indices}) -> u32 {
    return ${b.join(`+`)};
  }`,S=t=>(p.indicesToOffset=!0,o<2?t:`i2o_${e}(${t})`),C=(...e)=>o===0?`0u`:`${d.indices}(${e.map(f).join(`,`)})`,w=(e,t)=>o<2?`${e}`:`${K(e,t,o)}`,T=(e,t,n)=>o<2?`${e}=${n};`:`${K(e,t,o)}=${n};`,E={},D=(t,n)=>{p.broadcastedIndicesToOffset=!0;let r=`${n.name}broadcastedIndicesTo${e}Offset`;if(r in E)return`${r}(${t})`;let i=[];for(let e=o-1;e>=0;e--){let t=n.indicesGet(`outputIndices`,e+n.rank-o);i.push(`${w(g,e)} * (${t} % ${w(h,e)})`)}return E[r]=`fn ${r}(outputIndices: ${n.type.indices}) -> u32 {
             return ${i.length>0?i.join(`+`):`0u`};
           }`,`${r}(${t})`},O=(t,n)=>(()=>{if(d.storage===d.value)return`${e}[${t}]=${n};`;if(d.storage===`vec2<u32>`&&d.value===`i32`)return`${e}[${t}]=vec2<u32>(u32(${n}), select(0u, 0xFFFFFFFFu, ${n} < 0));`;if(d.storage===`vec2<u32>`&&d.value===`u32`)return`${e}[${t}]=vec2<u32>(u32(${n}), 0u);`;if(d.storage===`u32`&&d.value===`vec4<bool>`)return`${e}[${t}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${n}));`;throw Error(`not supported combination of storage type ${d.storage} and value type ${d.value} yet`)})(),k=t=>(()=>{if(d.storage===d.value)return`${e}[${t}]`;if(d.storage===`vec2<u32>`&&d.value===`i32`)return`i32(${e}[${t}].x)`;if(d.storage===`vec2<u32>`&&d.value===`u32`)return`u32(${e}[${t}].x)`;if(d.storage===`u32`&&d.value===`vec4<bool>`)return`vec4<bool>(bool(${e}[${t}] & 0xFFu), bool(${e}[${t}] & 0xFF00u), bool(${e}[${t}] & 0xFF0000u), bool(${e}[${t}] & 0xFF000000u))`;throw Error(`not supported combination of storage type ${d.storage} and value type ${d.value} yet`)})(),A=o<2?``:`
  fn get_${e}ByIndices(indices: ${d.indices}) -> ${u} {
    return ${k(`i2o_${e}(indices)`)};
  }`,j=o<2?``:(()=>{let t=s.map(e=>`d${e}: u32`).join(`, `),n=s.map(e=>`d${e}`).join(`, `);return`
  fn get_${e}(${t}) -> ${u} {
    return get_${e}ByIndices(${C(n)});
  }`})(),ee=(...t)=>{if(t.length!==o)throw Error(`indices length must be ${o}`);let n=t.map(f).join(`,`);return o===0?k(`0u`):o===1?k(n[0]):(p.get=!0,p.getByIndices=!0,p.indicesToOffset=!0,`get_${e}(${n})`)},te=t=>o<2?k(t):(p.getByIndices=!0,p.indicesToOffset=!0,`get_${e}ByIndices(${t})`),ne=o<2?``:`
  fn set_${e}ByIndices(indices: ${d.indices}, value: ${u}) {
    ${O(`i2o_${e}(indices)`,`value`)}
  }`,re=o<2?``:(()=>{let t=s.map(e=>`d${e}: u32`).join(`, `),n=s.map(e=>`d${e}`).join(`, `);return`
  fn set_${e}(${t}, value: ${u}) {
    set_${e}ByIndices(${C(n)}, value);
  }`})();return{impl:()=>{let e=[],t=!1;return p.offsetToIndices&&(e.push(v),t=!0),p.indicesToOffset&&(e.push(x),t=!0),p.broadcastedIndicesToOffset&&(Object.values(E).forEach(t=>e.push(t)),t=!0),p.set&&(e.push(re),t=!0),p.setByIndices&&(e.push(ne),t=!0),p.get&&(e.push(j),t=!0),p.getByIndices&&(e.push(A),t=!0),!a&&t&&e.unshift(`const ${h} = ${d.indices}(${n.join(`,`)});`,`const ${g} = ${d.indices}(${z.computeStrides(n).join(`,`)});`),e.join(`
`)},type:d,offsetToIndices:y,indicesToOffset:S,broadcastedIndicesToOffset:D,indices:C,indicesGet:w,indicesSet:T,set:(...t)=>{if(t.length!==o+1)throw Error(`indices length must be ${o}`);let n=t[o];if(typeof n!=`string`)throw Error(`value must be string`);let r=t.slice(0,o).map(f).join(`,`);return o===0?O(`0u`,n):o===1?O(r[0],n):(p.set=!0,p.setByIndices=!0,p.indicesToOffset=!0,`set_${e}(${r}, ${n})`)},setByOffset:O,setByIndices:(t,n)=>o<2?O(t,n):(p.setByIndices=!0,p.indicesToOffset=!0,`set_${e}ByIndices(${t}, ${n});`),get:ee,getByOffset:k,getByIndices:te,usage:r,name:e,strides:g,shape:h,rank:o}},q=(e,t,n,r=1)=>Mn(e,t,n,`input`,r),J=(e,t,n,r=1)=>Mn(e,t,n,`output`,r),Nn=(e,t,n)=>Mn(e,t,n,`atomicOutput`,1),Pn=(e,t,n,r=1)=>Mn(e,t,n,`internal`,r),Fn=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e==`number`?`${e}u`:e}) { return; }`}mainStart(e=En){let t=typeof e==`number`?e:e[0],n=typeof e==`number`?1:e[1],r=typeof e==`number`?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||n>this.limits.maxComputeWorkgroupSizeY||r>this.limits.maxComputeWorkgroupSizeZ)throw Error(`workgroup size [${t}, ${n}, ${r}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*n*r>this.limits.maxComputeInvocationsPerWorkgroup)throw Error(`workgroup size [${t}, ${n}, ${r}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let i=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1;return`@compute @workgroup_size(${t}, ${n}, ${r})
  fn main(${i?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`}) {
    ${i?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t*n*r}u + local_idx;`}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith(`uniforms.`)&&this.uniforms.push({name:e.shape.replace(`uniforms.`,``),type:`u32`,length:e.rank}),e.strides.startsWith(`uniforms.`)&&this.uniforms.push({name:e.strides.replace(`uniforms.`,``),type:`u32`,length:e.rank}))}declareVariable(e,t){if(e.usage===`internal`)throw Error(`cannot use internal variable with declareVariable(). use registerInternalVariables() instead.`);this.variables.push(e),this.appendVariableUniforms(e);let n=e.usage===`input`?`read`:`read_write`,r=e.usage===`atomicOutput`?`atomic<i32>`:e.type.storage;return`@group(0) @binding(${t}) var<storage, ${n}> ${e.name}: array<${r}>;`}declareVariables(...e){return e.map(e=>this.declareVariable(e,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!==`internal`)throw Error(`cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.`);this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(e=>this.registerInternalVariable(e)),this}registerUniform(e,t,n=1){return this.uniforms.push({name:e,type:t,length:n}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return``;let e=[];for(let{name:t,type:n,length:r}of this.uniforms)if(r&&r>4)n===`f16`?e.push(`@align(16) ${t}:array<mat2x4<${n}>, ${Math.ceil(r/8)}>`):e.push(`${t}:array<vec4<${n}>, ${Math.ceil(r/4)}>`);else{let i=r==null||r===1?n:`vec${r}<${n}>`;e.push(`${t}:${i}`)}return`
      struct Uniforms { ${e.join(`, `)} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=e=>[12,10,1,6][[`u32`,`f16`,`f32`,`i32`].indexOf(e)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},In=(e,t)=>new Fn(e,t)}),Ln,Rn,zn,Bn,Vn,Hn,Un,Wn,Gn,Kn=d(()=>{L(),B(),H(),Y(),Ln=(e,t)=>{if(!e||e.length!==1)throw Error(`Transpose requires 1 input.`);if(t.length!==0&&t.length!==e[0].dims.length)throw Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},Rn=(e,t)=>t.length===0?[...Array(e).keys()].reverse():t,zn=(e,t)=>z.sortBasedOnPerm(e,Rn(e.length,t)),Bn=(e,t,n,r)=>{let i=`fn perm(i: ${r.type.indices}) -> ${n.type.indices} {
    var a: ${n.type.indices};`;for(let n=0;n<t;++n)i+=`a[${e[n]}]=i[${n}];`;return i+=`return a;}`},Vn=(e,t)=>{let n=[],r=[];for(let i=0;i<e.length;++i)e[i]!==1&&n.push(e[i]),e[t[i]]!==1&&r.push(t[i]);return{newShape:n,newPerm:r}},Hn=(e,t)=>{let n=0;for(let r=0;r<e.length;++r)if(t[e[r]]!==1){if(e[r]<n)return!1;n=e[r]}return!0},Un=(e,t)=>{let n=e.dataType,r=e.dims.length,i=Rn(r,t),a=zn(e.dims,i),o=e.dims,s=a,c=r<2||Hn(i,e.dims),l;if(c)return l=e=>{let t=q(`input`,n,o,4),r=J(`output`,n,s,4);return`
  ${e.registerUniform(`output_size`,`u32`).declareVariables(t,r)}
  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
    output[global_idx] = input[global_idx];
  }`},{name:`TransposeCopy`,shaderCache:{inputDependencies:[`type`]},getRunData:()=>{let t=z.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(t/64/4)},programUniforms:[{type:12,data:Math.ceil(t/4)}]}},getShaderSource:l};let{newShape:u,newPerm:d}=Vn(e.dims,i),f=z.areEqual(d,[2,3,1]),p=z.areEqual(d,[3,1,2]);return u.length===2||f||p?(o=f?[u[0],u[1]*u[2]]:p?[u[0]*u[1],u[2]]:u,s=[o[1],o[0]],l=e=>{let t=q(`a`,n,o.length),r=J(`output`,n,s.length);return`
  ${e.registerUniform(`output_size`,`u32`).declareVariables(t,r)}
  var<workgroup> tile : array<array<${r.type.value}, 17>, 16>;
  ${e.mainStart([16,16,1])}
    let stride = (uniforms.output_shape[1] - 1) / 16 + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * 16u + local_id.x;
    let input_row = workgroup_id_x * 16u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${t.getByIndices(`${t.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * 16u + local_id.x;
    let output_row = workgroup_id_y * 16u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${r.setByIndices(`${r.type.indices}(output_row, output_col)`,`tile[local_id.x][local_id.y]`)}
    }
  }`},{name:`TransposeShared`,shaderCache:{inputDependencies:[`type`]},getRunData:()=>{let t=z.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(s[1]/16),y:Math.ceil(s[0]/16)},programUniforms:[{type:12,data:t},...W(o,s)]}},getShaderSource:l}):(l=e=>{let t=q(`a`,n,o.length),a=J(`output`,n,s.length);return`
  ${e.registerUniform(`output_size`,`u32`).declareVariables(t,a)}

  ${Bn(i,r,t,a)}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}

    let indices = ${a.offsetToIndices(`global_idx`)};
    let aIndices = perm(indices);

    ${a.setByOffset(`global_idx`,t.getByIndices(`aIndices`))}
  }`},{name:`Transpose`,shaderCache:{hint:`${t}`,inputDependencies:[`rank`]},getRunData:()=>{let t=z.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(t/64)},programUniforms:[{type:12,data:t},...W(o,s)]}},getShaderSource:l})},Wn=(e,t)=>{Ln(e.inputs,t.perm),e.compute(Un(e.inputs[0],t.perm))},Gn=e=>V({perm:e.perm})}),qn,Jn,Yn,Xn,Zn,Qn,$n,er,tr,nr,rr,ir,ar,or,sr,cr,lr,ur,dr,fr,pr,mr=d(()=>{L(),B(),Y(),Rr(),Kn(),qn={max:`select(bestValue, candidate, candidate > bestValue)`,min:`select(bestValue, candidate, candidate < bestValue)`,mean:`bestValue + candidate`,sum:`bestValue + candidate`,prod:`bestValue * candidate`,sumSquare:`bestValue + candidate * candidate`,logSumExp:`bestValue + exp(candidate)`,l1:`bestValue + abs(candidate)`,l2:`bestValue + candidate * candidate`,logSum:`bestValue + candidate`},Jn={max:`select(bestValue, candidate, candidate > bestValue)`,min:`select(bestValue, candidate, candidate < bestValue)`,mean:`bestValue + candidate`,sum:`bestValue + candidate`,prod:`bestValue * candidate`,sumSquare:`bestValue + candidate`,logSumExp:`bestValue + candidate`,l1:`bestValue + candidate`,l2:`bestValue + candidate`,logSum:`bestValue + candidate`},Yn={max:`_A[offset]`,min:`_A[offset]`,mean:`0`,sum:`0`,prod:`1`,sumSquare:`0`,logSumExp:`0`,l1:`0`,l2:`0`,logSum:`0`},Xn={max:`bestValue`,min:`bestValue`,sum:`bestValue`,prod:`bestValue`,sumSquare:`bestValue`,logSumExp:`log(bestValue)`,l1:`bestValue`,l2:`sqrt(bestValue)`,logSum:`log(bestValue)`},Zn=(e,t)=>{let n=[];for(let r=t-e;r<t;++r)n.push(r);return n},Qn=(e,t)=>{let n=[],r=e.length;for(let i=0;i<r;i++)t.indexOf(i)===-1&&n.push(e[i]);return[n,t.map(t=>e[t])]},$n=(e,t)=>{let n=e.length+t.length,r=[],i=0;for(let a=0;a<n;a++)t.indexOf(a)===-1?r.push(e[i++]):r.push(1);return r},er=(e,t)=>{for(let n=0;n<e.length;++n)if(e[e.length-n-1]!==t-1-n)return!1;return!0},tr=(e,t)=>{let n=[];if(!er(e,t)){for(let r=0;r<t;++r)e.indexOf(r)===-1&&n.push(r);e.forEach(e=>n.push(e))}return n},nr=(e,t,n,r,i,a,o)=>{let s=n[0].dims,c=z.size(a),l=z.size(o),u=q(`_A`,n[0].dataType,s),d=J(`output`,i,a),f=64;c===1&&(f=256);let p=`
          var<workgroup> aBestValues : array<f32, ${f}>;
       `;return{name:e,shaderCache:{hint:`${t};${f}`,inputDependencies:[`type`]},getShaderSource:e=>`
        ${e.registerUniform(`reduceSize`,`u32`).declareVariables(u,d)}
        ${p}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${e.mainStart(f)}

          let outputIndex = global_idx / ${f};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${Yn[r]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${f}) {
           let candidate = f32(${u.getByOffset(`offset + k`)});
           bestValue = ${qn[r]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${f}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${Jn[r]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${d.setByOffset(`outputIndex`,`${r===`mean`?`${d.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${d.type.storage}(${Xn[r]})`}`)};
         }
        }`,getRunData:()=>({outputs:[{dims:a,dataType:i}],dispatchGroup:{x:c},programUniforms:[{type:12,data:l}]})}},rr=(e,t,n,r)=>{let i=e.inputs.length===1?n:vr(e.inputs,n),a=i.axes;a.length===0&&!i.noopWithEmptyAxes&&(a=e.inputs[0].dims.map((e,t)=>t));let o=z.normalizeAxes(a,e.inputs[0].dims.length),s=o,c=e.inputs[0],l=tr(s,e.inputs[0].dims.length);l.length>0&&(c=e.compute(Un(e.inputs[0],l),{inputs:[0],outputs:[-1]})[0],s=Zn(s.length,c.dims.length));let[u,d]=Qn(c.dims,s),f=u;i.keepDims&&(f=$n(u,o)),e.compute(nr(t,i.cacheKey,[c],r,e.inputs[0].dataType,f,d),{inputs:[c]})},ir=(e,t)=>{rr(e,`ReduceMeanShared`,t,`mean`)},ar=(e,t)=>{rr(e,`ReduceL1Shared`,t,`l1`)},or=(e,t)=>{rr(e,`ReduceL2Shared`,t,`l2`)},sr=(e,t)=>{rr(e,`ReduceLogSumExpShared`,t,`logSumExp`)},cr=(e,t)=>{rr(e,`ReduceMaxShared`,t,`max`)},lr=(e,t)=>{rr(e,`ReduceMinShared`,t,`min`)},ur=(e,t)=>{rr(e,`ReduceProdShared`,t,`prod`)},dr=(e,t)=>{rr(e,`ReduceSumShared`,t,`sum`)},fr=(e,t)=>{rr(e,`ReduceSumSquareShared`,t,`sumSquare`)},pr=(e,t)=>{rr(e,`ReduceLogSumShared`,t,`logSum`)}}),hr,gr,_r,vr,yr,br,X,xr,Sr,Z,Cr,Q,wr,Tr,Er,Dr,Or,kr,Ar,jr,Mr,Nr,Pr,Fr,Ir,Lr,Rr=d(()=>{L(),B(),H(),Y(),mr(),hr=e=>{if(!e||e.length===0||e.length>2)throw Error(`Reduce op requires 1 or 2 inputs.`);if(e.length===2&&e[1].dims.length!==1)throw Error(`Invalid axes input dims.`)},gr=e=>[``,``,`var value = ${e.getByIndices(`input_indices`)};`,``],_r=(e,t,n,r,i,a,o=!1,s=!1)=>{let c=[],l=n[0].dims,u=l.length,d=z.normalizeAxes(i,u),f=!s&&d.length===0;l.forEach((e,t)=>{f||d.indexOf(t)>=0?o&&c.push(1):c.push(e)});let p=c.length,m=z.size(c);return{name:e,shaderCache:t,getShaderSource:e=>{let t=[],i=q(`_A`,n[0].dataType,u),s=J(`output`,a,p),c=r(i,s,d),m=c[2];for(let e=0,n=0;e<u;e++)f||d.indexOf(e)>=0?(o&&n++,m=`for(var j${e}: u32 = 0; j${e} < ${l[e]}; j${e}++) {
                  ${c[2].includes(`last_index`)?`let last_index = j${e};`:``}
                  ${i.indicesSet(`input_indices`,e,`j${e}`)}
                  ${m}
                }`):(t.push(`${i.indicesSet(`input_indices`,e,s.indicesGet(`output_indices`,n))};`),n++);return`

        ${e.registerUniform(`output_size`,`u32`).declareVariables(i,s)}

        ${e.mainStart()}
          ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
          var input_indices: ${i.type.indices};
          let output_indices = ${s.offsetToIndices(`global_idx`)};

          ${t.join(`
`)}
          ${c[0]}       // init ops for reduce max/min
          ${c[1]}
          ${m}
          ${c[3]}
          ${c.length===4?s.setByOffset(`global_idx`,`value`):c.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:c,dataType:a}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:[{type:12,data:m},...W(l,c)]})}},vr=(e,t)=>{let n=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(e=>n.push(Number(e))),V({axes:n,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},yr=(e,t,n,r)=>{let i=e.inputs,a=i.length===1?n:vr(i,n);e.compute(_r(t,{hint:a.cacheKey,inputDependencies:[`rank`]},[i[0]],a.noopWithEmptyAxes&&a.axes.length===0?gr:r,a.axes,i[0].dataType,a.keepDims,a.noopWithEmptyAxes),{inputs:[0]})},br=(e,t)=>{hr(e.inputs),yr(e,`ReduceLogSum`,t,(e,t)=>[`var value = ${t.type.storage}(0);`,``,`value += ${e.getByIndices(`input_indices`)};`,`value = log(value);`])},X=(e,t)=>{hr(e.inputs),yr(e,`ReduceL1`,t,(e,t)=>[`var value = ${t.type.storage}(0);`,``,`value += abs(${e.getByIndices(`input_indices`)});`,``])},xr=(e,t)=>{hr(e.inputs),yr(e,`ReduceL2`,t,(e,t)=>[`var t = ${t.type.value}(0); var value = ${t.type.value}(0);`,``,`t = ${e.getByIndices(`input_indices`)}; value += (t * t);`,`value = sqrt(value);`])},Sr=(e,t)=>{hr(e.inputs),yr(e,`ReduceLogSumExp`,t,(e,t)=>[`var value = ${t.type.storage}(0);`,``,`value += exp(${e.getByIndices(`input_indices`)});`,`value = log(value);`])},Z=(e,t)=>{hr(e.inputs),yr(e,`ReduceMax`,t,(e,t,n)=>{let r=[];for(let t=0;t<e.rank;t++)(n.indexOf(t)>=0||n.length===0)&&r.push(e.indicesSet(`input_indices`,t,0));return[`${r.join(`
`)}`,`var value = ${e.getByIndices(`input_indices`)};`,`value = max(value, ${e.getByIndices(`input_indices`)});`,``]})},Cr=(e,t)=>{hr(e.inputs),yr(e,`ReduceMean`,t,(t,n,r)=>{let i=1;for(let n=0;n<t.rank;n++)(r.indexOf(n)>=0||r.length===0)&&(i*=e.inputs[0].dims[n]);return[`var sum = f32(0);`,``,`sum += f32(${t.getByIndices(`input_indices`)});`,`let value = ${n.type.value}(sum / ${i});`]})},Q=(e,t)=>{hr(e.inputs),yr(e,`ReduceMin`,t,(e,t,n)=>{let r=[];for(let t=0;t<e.rank;t++)(n.indexOf(t)>=0||n.length===0)&&r.push(`input_indices[${t}] = 0;`);return[`${r.join(`
`)}`,`var value = ${e.getByIndices(`input_indices`)};`,`value = min(value, ${e.getByIndices(`input_indices`)});`,``]})},wr=(e,t)=>{hr(e.inputs),yr(e,`ReduceProd`,t,(e,t)=>[`var value = ${t.type.storage}(1);`,``,`value *= ${e.getByIndices(`input_indices`)};`,``])},Tr=(e,t)=>{hr(e.inputs),yr(e,`ReduceSum`,t,(e,t)=>[`var value = ${t.type.storage}(0);`,``,`value += ${e.getByIndices(`input_indices`)};`,``])},Er=(e,t)=>{hr(e.inputs),yr(e,`ReduceSumSquare`,t,(e,t)=>[`var t = ${t.type.value}(0); var value = ${t.type.value}(0);`,``,`t = ${e.getByIndices(`input_indices`)}; value += t * t;`,``])},Dr=(e,t,n)=>{if(t.length===0)return n;let r=1,i=1;for(let n=0;n<t.length;n++)t.indexOf(n)===-1?r*=e[n]:i*=e[n];return i<32&&r>1024},Or=(e,t)=>{Dr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Cr(e,t):ir(e,t)},kr=(e,t)=>{Dr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?X(e,t):ar(e,t)},Ar=(e,t)=>{Dr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?xr(e,t):or(e,t)},jr=(e,t)=>{Dr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Sr(e,t):sr(e,t)},Mr=(e,t)=>{Dr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Z(e,t):cr(e,t)},Nr=(e,t)=>{Dr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Q(e,t):lr(e,t)},Pr=(e,t)=>{Dr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?wr(e,t):ur(e,t)},Fr=(e,t)=>{Dr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Tr(e,t):dr(e,t)},Ir=(e,t)=>{Dr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Er(e,t):fr(e,t)},Lr=(e,t)=>{Dr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?br(e,t):pr(e,t)}}),zr,Br,Vr,Hr,Ur=d(()=>{L(),H(),Rr(),zr=e=>{if(!e||e.length===0||e.length>2)throw Error(`ArgMinMaxOp op requires 1 or 2 inputs.`);if(e[0].dataType!==1)throw Error(`Invalid input type.`)},Br=(e,t)=>{zr(e.inputs),e.compute(_r(`ArgMin`,{hint:t.cacheKey,inputDependencies:[`rank`]},[e.inputs[0]],(e,n,r)=>{let i=[];for(let t=0;t<e.rank;t++)(r.indexOf(t)>=0||r.length===0)&&i.push(`input_indices[${t}] = 0;`);return[`${i.join(`
`)}`,`var value = ${e.getByIndices(`input_indices`)};
var best_index : i32 = 0;`,`if (${e.getByIndices(`input_indices`)} ${t.selectLastIndex>0?`<=`:`<`} value) {
         value = ${e.getByIndices(`input_indices`)};
         best_index = i32(last_index);
       }`,``,n.setByOffset(`global_idx`,`best_index`)]},[t.axis],7,t.keepDims),{inputs:[0]})},Vr=(e,t)=>{zr(e.inputs),e.compute(_r(`argMax`,{hint:t.cacheKey,inputDependencies:[`rank`]},[e.inputs[0]],(e,n,r)=>{let i=[];for(let t=0;t<e.rank;t++)(r.indexOf(t)>=0||r.length===0)&&i.push(`input_indices[${t}] = 0;`);return[`${i.join(`
`)}`,`var value = ${e.getByIndices(`input_indices`)};
var best_index : i32 = 0;`,`if (${e.getByIndices(`input_indices`)} ${t.selectLastIndex>0?`>=`:`>`} value) {
         value = ${e.getByIndices(`input_indices`)};
         best_index = i32(last_index);
       }`,``,n.setByOffset(`global_idx`,`best_index`)]},[t.axis],7,t.keepDims),{inputs:[0]})},Hr=e=>V(e)}),Wr,Gr,Kr,qr,Jr,Yr,Xr,Zr,Qr=d(()=>{L(),B(),mn(),Y(),Wr=(e,t)=>{let n=e[0],r=e[1],i=e[2],a=e[3],o=e[4],s=e[5];if(o&&s)throw Error(`Attention cannot have both past and attention_bias`);if(n.dims.length!==3)throw Error(`Input "input" must have 3 dimensions`);let c=n.dims[0],l=n.dims[1],u=n.dims[2];if(i.dims.length!==1)throw Error(`Input "bias" is expected to have 1 dimensions`);if(r.dims.length!==2)throw Error(`Input "weights" is expected to have 2 dimensions`);if(r.dims[0]!==u)throw Error(`Input 1 dimension 0 should have same length as dimension 2 of input 0`);if(i.dims[0]!==r.dims[1])throw Error(`Input "bias" dimension 0 should have same length as dimension 1 of input "weights"`);let d=i.dims[0]/3,f=d,p=f;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw Error(`qkv_hidden_sizes attribute should have 3 elements`);for(let e of t.qkvHiddenSizes)if(e%t.numHeads!==0)throw Error(`qkv_hidden_sizes should be divisible by num_heads`);d=t.qkvHiddenSizes[0],f=t.qkvHiddenSizes[1],p=t.qkvHiddenSizes[2]}let m=l;if(d!==f)throw Error(`qkv_hidden_sizes first element should be same as the second`);if(i.dims[0]!==d+f+p)throw Error(`Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes`);let h=0;if(o){if(f!==p)throw Error(`Input "past" expect k_hidden_size == v_hidden_size`);if(o.dims.length!==5)throw Error(`Input "past" must have 5 dimensions`);if(o.dims[0]!==2)throw Error(`Input "past" first dimension must be 2`);if(o.dims[1]!==c)throw Error(`Input "past" second dimension must be batch_size`);if(o.dims[2]!==t.numHeads)throw Error(`Input "past" third dimension must be num_heads`);if(o.dims[4]!==f/t.numHeads)throw Error(`Input "past" fifth dimension must be k_hidden_size / num_heads`);t.pastPresentShareBuffer||(h=o.dims[3])}let g=m+h;if(a)throw Error(`Mask not supported`);if(o)throw Error(`past is not supported`);if(s){if(s.dims.length!==4)throw Error(`Input "attention_bias" must have 4 dimensions`);if(s.dims[0]!==c||s.dims[1]!==t.numHeads||s.dims[2]!==l||s.dims[3]!==g)throw Error(`Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)`)}return{batchSize:c,sequenceLength:l,pastSequenceLength:h,kvSequenceLength:m,totalSequenceLength:g,maxSequenceLength:-1,inputHiddenSize:u,hiddenSize:d,vHiddenSize:p,headSize:Math.floor(d/t.numHeads),vHeadSize:Math.floor(p/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:0,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},Gr=(e,t,n)=>t&&e?`
      let total_sequence_length_input = u32(${t.getByOffset(`0`)});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${e?.getByOffset(`batchIdx`)}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${n?`let past_sequence_length = uniforms.past_sequence_length`:``};
    let present_sequence_length = total_sequence_length;
    `,Kr=(e,t,n,r,i,a,o,s)=>{let c=G(o?1:a),l=64,u=a/c;u<l&&(l=32);let d=Math.ceil(a/c/l),f=[{type:12,data:t},{type:12,data:n},{type:12,data:r},{type:12,data:i},{type:12,data:u},{type:12,data:d}],p=U(e.dataType,c),m=On(1,c),h=[`type`];return o&&h.push(`type`),s&&h.push(`type`),{name:`AttentionProbsSoftmax`,shaderCache:{hint:`${l};${p};${c}`,inputDependencies:h},getShaderSource:t=>{let n=J(`x`,e.dataType,e.dims,c),r=[n],i=o?q(`seq_lens`,o.dataType,o.dims):void 0;i&&r.push(i);let a=s?q(`total_sequence_length_input`,s.dataType,s.dims):void 0;a&&r.push(a);let u=On(e.dataType);return`
  var<workgroup> thread_max: array<f32, ${l}>;
  var<workgroup> thread_sum: array<f32, ${l}>;
  ${t.registerUniforms([{name:`batch_size`,type:`u32`},{name:`num_heads`,type:`u32`},{name:`past_sequence_length`,type:`u32`},{name:`sequence_length`,type:`u32`},{name:`total_sequence_length`,type:`u32`},{name:`elements_per_thread`,type:`u32`}]).declareVariables(...r)}
  ${t.mainStart([l,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${Gr(i,a,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${l}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${o?`u32(past_sequence_length + workgroup_id.y + 1)`:`total_sequence_length`};
    var thread_max_vector = ${m}(-3.4028234663852886e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${m}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(c){case 1:return`thread_max_vector`;case 2:return`max(thread_max_vector.x, thread_max_vector.y)`;case 4:return`max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))`;default:throw Error(`Unsupported components: ${c}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.4028234663852886e+38f);
    for (var i = 0u; i < ${l}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${m}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${m}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(c){case 1:return`sum_vector`;case 2:return`sum_vector.x + sum_vector.y`;case 4:return`sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w`;default:throw Error(`Unsupported components: ${c}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${l}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${n.type.value}(${u}(1.0) / ${u}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${m}(x[offset + i]);
        x[offset + i] = ${n.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${o?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${n.type.value}(${u}(0));
        }`:``};
  }`},getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:i,z:t*n},programUniforms:f})}},qr=(e,t,n,r,i,a,o,s,c)=>{let l=o+a.kvSequenceLength,u=[a.batchSize,a.numHeads,a.sequenceLength,l],d=e>1&&r,f=a.kvNumHeads?a.kvNumHeads:a.numHeads,p=d?[a.batchSize,f,l,a.headSize]:void 0,m=a.nReps?a.nReps:1,h=a.scale===0?1/Math.sqrt(a.headSize):a.scale,g=G(a.headSize),_=a.headSize/g,v={x:Math.ceil(l/12),y:Math.ceil(a.sequenceLength/12),z:a.batchSize*a.numHeads},y=[{type:12,data:a.sequenceLength},{type:12,data:_},{type:12,data:l},{type:12,data:a.numHeads},{type:12,data:a.headSize},{type:1,data:h},{type:12,data:o},{type:12,data:a.kvSequenceLength},{type:12,data:m}],b=d&&r&&z.size(r.dims)>0,x=[`type`,`type`];b&&x.push(`type`),i&&x.push(`type`),s&&x.push(`type`),c&&x.push(`type`);let S=[{dims:u,dataType:t.dataType,gpuDataType:0}];return d&&S.push({dims:p,dataType:t.dataType,gpuDataType:0}),{name:`AttentionProbs`,shaderCache:{hint:`${g};${i!==void 0};${r!==void 0};${e}`,inputDependencies:x},getRunData:()=>({outputs:S,dispatchGroup:v,programUniforms:y}),getShaderSource:e=>{let a=q(`q`,t.dataType,t.dims,g),o=[a,q(`key`,n.dataType,n.dims,g)];if(b){let e=q(`past_key`,r.dataType,r.dims,g);o.push(e)}i&&o.push(q(`attention_bias`,i.dataType,i.dims));let l=s?q(`seq_lens`,s.dataType,s.dims):void 0;l&&o.push(l);let f=c?q(`total_sequence_length_input`,c.dataType,c.dims):void 0;f&&o.push(f);let h=J(`output`,t.dataType,u),_=[h];d&&_.push(J(`present_key`,t.dataType,p,g));let v=On(1,g);return`
  const TILE_SIZE = 12u;

  var<workgroup> tileQ: array<${a.type.storage}, 144>;
  var<workgroup> tileK: array<${a.type.storage}, 144>;
  ${e.registerUniforms([{name:`M`,type:`u32`},{name:`K`,type:`u32`},{name:`N`,type:`u32`},{name:`num_heads`,type:`u32`},{name:`head_size`,type:`u32`},{name:`alpha`,type:`f32`},{name:`past_sequence_length`,type:`u32`},{name:`kv_sequence_length`,type:`u32`},{name:`n_reps`,type:`u32`}]).declareVariables(...o,..._)}
  ${e.mainStart([12,12,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${m===1?`headIdx`:`headIdx / uniforms.n_reps`};
    let kv_num_heads = ${m===1?`uniforms.num_heads`:`uniforms.num_heads / uniforms.n_reps`};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${Gr(l,f,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${b&&d?`let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;`:``};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${d?`let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;`:``}
    var value = ${v}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${b&&d?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${d?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:``}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${v}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(g){case 1:return`value`;case 2:return`value.x + value.y`;case 4:return`value.x + value.y + value.z + value.w`;default:throw Error(`Unsupported components: ${g}`)}})()};
        output[outputIdx] = ${h.type.value} (sum * uniforms.alpha) + ${i?`attention_bias[outputIdx]`:`0.0`};
    }
  }`}}},Jr=(e,t,n,r,i,a,o=void 0,s=void 0)=>{let c=a+i.kvSequenceLength,l=i.nReps?i.nReps:1,u=i.vHiddenSize*l,d=e>1&&r,f=i.kvNumHeads?i.kvNumHeads:i.numHeads,p=d?[i.batchSize,f,c,i.headSize]:void 0,m=[i.batchSize,i.sequenceLength,u],h={x:Math.ceil(i.vHeadSize/12),y:Math.ceil(i.sequenceLength/12),z:i.batchSize*i.numHeads},g=[{type:12,data:i.sequenceLength},{type:12,data:c},{type:12,data:i.vHeadSize},{type:12,data:i.numHeads},{type:12,data:i.headSize},{type:12,data:u},{type:12,data:a},{type:12,data:i.kvSequenceLength},{type:12,data:l}],_=d&&r&&z.size(r.dims)>0,v=[`type`,`type`];_&&v.push(`type`),o&&v.push(`type`),s&&v.push(`type`);let y=[{dims:m,dataType:t.dataType,gpuDataType:0}];return d&&y.push({dims:p,dataType:t.dataType,gpuDataType:0}),{name:`AttentionScore`,shaderCache:{hint:`${r!==void 0};${e}`,inputDependencies:v},getRunData:()=>({outputs:y,dispatchGroup:h,programUniforms:g}),getShaderSource:e=>{let i=q(`probs`,t.dataType,t.dims),a=[i,q(`v`,n.dataType,n.dims)];_&&a.push(q(`past_value`,r.dataType,r.dims));let c=o?q(`seq_lens`,o.dataType,o.dims):void 0;o&&a.push(c);let u=s?q(`total_sequence_length_input`,s.dataType,s.dims):void 0;s&&a.push(u);let f=[J(`output`,t.dataType,m)];return d&&f.push(J(`present_value`,t.dataType,p)),`
  const TILE_SIZE = 12u;
  var<workgroup> tileQ: array<${i.type.value}, 144>;
  var<workgroup> tileV: array<${i.type.value}, 144>;
  ${e.registerUniforms([{name:`M`,type:`u32`},{name:`K`,type:`u32`},{name:`N`,type:`u32`},{name:`num_heads`,type:`u32`},{name:`head_size`,type:`u32`},{name:`v_hidden_size`,type:`u32`},{name:`past_sequence_length`,type:`u32`},{name:`kv_sequence_length`,type:`u32`},{name:`n_reps`,type:`u32`}]).declareVariables(...a,...f)}
  ${e.mainStart([12,12,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${l===1?`headIdx`:`headIdx / uniforms.n_reps`};
   let kv_num_heads = ${l===1?`uniforms.num_heads`:`uniforms.num_heads / uniforms.n_reps`};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${Gr(c,u,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${_&&d?`let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;`:``};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${d?`let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;`:``}
   var value = ${i.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${_&&d?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${d?`
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }`:``}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`}}},Yr=(e,t,n,r,i,a,o,s,c,l,u=void 0,d=void 0)=>{let f=Math.min(e.outputCount,1+ +!!o+ +!!s),p=f>1?o:void 0,m=f>1?s:void 0,h=f>1?l.pastSequenceLength:0,g=h+l.kvSequenceLength,_=c&&z.size(c.dims)>0?c:void 0,v=[t,n];p&&z.size(p.dims)>0&&v.push(p),_&&v.push(_),u&&v.push(u),d&&v.push(d);let y=e.compute(qr(f,t,n,p,_,l,h,u,d),{inputs:v,outputs:f>1?[-1,1]:[-1]})[0];e.compute(Kr(y,l.batchSize,l.numHeads,h,l.sequenceLength,g,u,d),{inputs:u&&d?[y,u,d]:[y],outputs:[]});let b=[y,r];m&&z.size(m.dims)>0&&b.push(m),u&&b.push(u),d&&b.push(d),e.compute(Jr(f,y,r,m,l,h,u,d),{inputs:b,outputs:f>1?[0,2]:[0]})},Xr=(e,t)=>{let n=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],r=t.sequenceLength,i=t.inputHiddenSize,a=t.headSize,o={x:Math.ceil(t.headSize/12),y:Math.ceil(t.sequenceLength/12),z:t.batchSize*t.numHeads},s=[e.inputs[0],e.inputs[1],e.inputs[2]],c=[{type:12,data:r},{type:12,data:i},{type:12,data:a},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}];return e.compute({name:`AttentionPrepare`,shaderCache:{inputDependencies:[`type`,`type`,`type`]},getRunData:()=>({outputs:[{dims:n,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:n,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:n,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:o,programUniforms:c}),getShaderSource:e=>{let t=J(`output_q`,s[0].dataType,n),r=J(`output_k`,s[0].dataType,n),i=J(`output_v`,s[0].dataType,n),a=q(`input`,s[0].dataType,s[0].dims),o=q(`weight`,s[1].dataType,s[1].dims),c=q(`bias`,s[2].dataType,s[2].dims),l=a.type.storage;return`
  const TILE_SIZE = 12u;
  var<workgroup> tileInput: array<${l}, 144>;
  var<workgroup> tileWeightQ: array<${l}, 144>;
  var<workgroup> tileWeightK: array<${l}, 144>;
  var<workgroup> tileWeightV: array<${l}, 144>;
  ${e.registerUniforms([{name:`M`,type:`u32`},{name:`K`,type:`u32`},{name:`N`,type:`u32`},{name:`num_heads`,type:`u32`},{name:`head_size`,type:`u32`},{name:`hidden_size`,type:`u32`},{name:`ldb`,type:`u32`}]).declareVariables(a,o,c,t,r,i)}
  ${e.mainStart([12,12,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${l}(0);
    var valueK = ${l}(0);
    var valueV = ${l}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`}},{inputs:s,outputs:[-1,-1,-1]})},Zr=(e,t)=>{let n=Wr(e.inputs,t),[r,i,a]=Xr(e,n);return Yr(e,r,i,a,e.inputs[4],void 0,void 0,void 0,e.inputs[5],n)}}),$r,ei,ti,ni,ri=d(()=>{Ne(),L(),B(),H(),Y(),$r=(e,t)=>{if(!e||e.length!==5)throw Error(`BatchNormalization requires 5 inputs`);let n=(e,t,n)=>{let r=t.length;if(r!==e.length)throw Error(`${n}: num dimensions != ${r}`);t.forEach((t,r)=>{if(t!==e[r])throw Error(`${n}: dim[${r}] do not match`)})};if(e[0].dims.length>1){let r=t.format===`NHWC`?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);n(e[1].dims,r,`Invalid input scale`),n(e[2].dims,r,`Invalid input B`),n(e[3].dims,r,`Invalid input mean`),n(e[4].dims,r,`Invalid input var`)}else n(e[1].dims,[1],`Invalid input scale`),n(e[2].dims,[1],`Invalid input B`),n(e[3].dims,[1],`Invalid input mean`),n(e[4].dims,[1],`Invalid input var`)},ei=(e,t)=>{let{epsilon:n,spatial:r,format:i}=t,a=e[0].dims,o=r?G(a[a.length-1]):1,s=i===`NHWC`&&a.length>1?o:1,c=z.size(a)/o,l=r,u=l?a.length:a,d=q(`x`,e[0].dataType,e[0].dims,o),f=q(`scale`,e[1].dataType,e[1].dims,s),p=q(`bias`,e[2].dataType,e[2].dims,s),m=q(`inputMean`,e[3].dataType,e[3].dims,s),h=q(`inputVar`,e[4].dataType,e[4].dims,s),g=J(`y`,e[0].dataType,u,o),_=()=>{let e=``;if(r)e=`let cOffset = ${a.length===1?`0u`:i===`NHWC`?`outputIndices[${a.length-1}] / ${o}`:`outputIndices[1]`};`;else if(i===`NCHW`)e=`
            ${g.indicesSet(`outputIndices`,`0`,`0`)}
            let cOffset = ${g.indicesToOffset(`outputIndices`)};`;else{e=`var cIndices = ${f.type.indices}(0);
                       cIndices[0] = outputIndices[${a.length-1}];`;for(let t=1;t<f.rank;t++)e+=`cIndices[${t}] = outputIndices[${t}];`;e+=`let cOffset = ${f.indicesToOffset(`cIndices`)};`}return e};return{name:`BatchNormalization`,shaderCache:{hint:`${t.epsilon}_${t.format}_${r}_${o}`,inputDependencies:l?[`rank`,`type`,`type`,`type`,`type`]:void 0},getShaderSource:e=>`
  const epsilon = ${n};
  ${e.registerUniform(`outputSize`,`u32`).declareVariables(d,f,p,m,h,g)}
  ${e.mainStart()}
  ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}
    var outputIndices = ${g.offsetToIndices(`global_idx * ${o}`)};
    ${_()}
    let scale = ${f.getByOffset(`cOffset`)};
    let bias = ${p.getByOffset(`cOffset`)};
    let inputMean = ${m.getByOffset(`cOffset`)};
    let inputVar = ${h.getByOffset(`cOffset`)};
    let x = ${d.getByOffset(`global_idx`)};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${g.setByOffset(`global_idx`,`value`)}
  }`,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:l?[{type:12,data:c},...W(a)]:[{type:12,data:c}]})}},ti=e=>V(e),ni=(e,t)=>{let{inputs:n,outputCount:r}=e,i=ti({...t,outputCount:r});if(D.webgpu.validateInputContent&&$r(n,i),t.trainingMode)throw Error(`BatchNormalization trainingMode is not supported yet.`);e.compute(ei(n,i))}}),ii,ai,oi,si=d(()=>{B(),Y(),ii=e=>{if(e[0].dims.length!==3)throw Error(`input should have 3 dimensions`);if(![320,640,1280].includes(e[0].dims[2]))throw Error(`number of channels should be 320, 640 or 1280`);if(e[1].dims.length!==1)throw Error(`bias is expected to have 1 dimensions`);if(e[0].dims[2]!==e[1].dims[0])throw Error(`last dimension of input and bias are not the same`)},ai=e=>{let t=e[0].dims,n=e[0].dims[2],r=z.size(t)/4,i=e[0].dataType,a=q(`input`,i,t,4),o=q(`bias`,i,[n],4),s=q(`residual`,i,t,4),c=J(`output`,i,t,4);return{name:`BiasAdd`,getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(r/64)}}),getShaderSource:e=>`
  const channels = ${n}u / 4;
  ${e.declareVariables(a,o,s,c)}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(r)}
    let value = ${a.getByOffset(`global_idx`)}
      + ${o.getByOffset(`global_idx % channels`)} + ${s.getByOffset(`global_idx`)};
    ${c.setByOffset(`global_idx`,`value`)}
  }`}},oi=e=>{ii(e.inputs),e.compute(ai(e.inputs))}}),ci,$,li,ui,di,fi,pi,mi,hi,gi,_i,vi,yi,bi,xi,Si,Ci,wi,Ti,Ei,Di,Oi,ki,Ai,ji,Mi,Ni,Pi,Fi,Ii,Li,Ri,zi,Bi,Vi,Hi,Ui,Wi,Gi,Ki,qi,Ji,Yi,Xi,Zi,Qi=d(()=>{L(),B(),H(),Y(),ci=(e,t,n,r,i,a,o)=>{let s=Math.ceil(t/4),c=``;c=typeof i==`string`?`${i}(a)`:i(`a`);let l=q(`inputData`,n,[s],4),u=J(`outputData`,r,[s],4),d=[{name:`vec_size`,type:`u32`}];return o&&d.push(...o),`
      ${e.registerUniforms(d).declareVariables(l,u)}

  ${a??``}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.vec_size`)}

    let a = ${l.getByOffset(`global_idx`)};
    ${u.setByOffset(`global_idx`,c)}
  }`},$=(e,t,n,r,i,a=e.dataType,o,s)=>{let c=[{type:12,data:Math.ceil(z.size(e.dims)/4)}];return o&&c.push(...o),{name:t,shaderCache:{hint:i,inputDependencies:[`type`]},getShaderSource:t=>ci(t,z.size(e.dims),e.dataType,a,n,r,s),getRunData:t=>({outputs:[{dims:e.dims,dataType:a}],dispatchGroup:{x:Math.ceil(z.size(t[0].dims)/64/4)},programUniforms:c})}},li=e=>{e.compute($(e.inputs[0],`Abs`,`abs`))},ui=e=>{e.compute($(e.inputs[0],`Acos`,`acos`))},di=e=>{e.compute($(e.inputs[0],`Acosh`,`acosh`))},fi=e=>{e.compute($(e.inputs[0],`Asin`,`asin`))},pi=e=>{e.compute($(e.inputs[0],`Asinh`,`asinh`))},mi=e=>{e.compute($(e.inputs[0],`Atan`,`atan`))},hi=e=>{e.compute($(e.inputs[0],`Atanh`,`atanh`))},gi=e=>V(e),_i=(e,t)=>{let n;switch(t.to){case 10:n=`vec4<f16>`;break;case 1:n=`vec4<f32>`;break;case 12:n=`vec4<u32>`;break;case 6:n=`vec4<i32>`;break;case 9:n=`vec4<bool>`;break;default:throw RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute($(e.inputs[0],`Cast`,n,void 0,t.cacheKey,t.to))},vi=e=>{let t,n,r=e.length>=2&&e[1].data!==0,i=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=r?e[1].getFloat32Array()[0]:-34028234663852886e22,n=i?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=r?e[1].getUint16Array()[0]:64511,n=i?e[2].getUint16Array()[0]:31743;break;default:throw Error(`Unsupport data type`)}return V({min:t,max:n})},yi=(e,t)=>{let n=t||vi(e.inputs),r=On(e.inputs[0].dataType);e.compute($(e.inputs[0],`Clip`,e=>`clamp(${e}, vec4<${r}>(uniforms.min), vec4<${r}>(uniforms.max))`,void 0,n.cacheKey,void 0,[{type:e.inputs[0].dataType,data:n.min},{type:e.inputs[0].dataType,data:n.max}],[{name:`min`,type:r},{name:`max`,type:r}]),{inputs:[0]})},bi=e=>{e.compute($(e.inputs[0],`Ceil`,`ceil`))},xi=e=>{e.compute($(e.inputs[0],`Cos`,`cos`))},Si=e=>{e.compute($(e.inputs[0],`Cosh`,`cosh`))},Ci=e=>V(e),wi=(e,t)=>{let n=On(e.inputs[0].dataType);e.compute($(e.inputs[0],`Elu`,e=>`elu_vf32(${e})`,`
  const elu_alpha_ = ${n}(${t.alpha});

  fn elu_f32(a: ${n}) -> ${n} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${n}>) -> vec4<${n}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},Ti=(e=`f32`)=>`
const r0: ${e} = 0.3275911;
const r1: ${e} = 0.254829592;
const r2: ${e} = -0.284496736;
const r3: ${e} = 1.421413741;
const r4: ${e} = -1.453152027;
const r5: ${e} = 1.061405429;

fn erf_vf32(v: vec4<${e}>) -> vec4<${e}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,Ei=e=>{let t=On(e.inputs[0].dataType);e.compute($(e.inputs[0],`Erf`,e=>`erf_vf32(${e})`,Ti(t)))},Di=e=>{e.compute($(e.inputs[0],`Exp`,`exp`))},Oi=e=>{e.compute($(e.inputs[0],`Floor`,`floor`))},ki=e=>{let t=On(e.inputs[0].dataType);e.compute($(e.inputs[0],`Gelu`,e=>`0.5 * ${e} * (1.0 + erf_vf32(${e} * 0.7071067811865475))`,Ti(t)))},Ai=(e,t)=>{let n=On(e.inputs[0].dataType);e.compute($(e.inputs[0],`LeakyRelu`,e=>`select(leaky_relu_alpha_ * ${e}, ${e}, ${e} >= vec4<${n}>(0.0))`,`const leaky_relu_alpha_ = ${n}(${t.alpha});`,t.cacheKey))},ji=e=>{e.compute($(e.inputs[0],`Not`,e=>`!${e}`))},Mi=e=>{e.compute($(e.inputs[0],`Neg`,e=>`-${e}`))},Ni=e=>{e.compute($(e.inputs[0],`Reciprocal`,e=>`1.0/${e}`))},Pi=e=>{let t=On(e.inputs[0].dataType);e.compute($(e.inputs[0],`Relu`,e=>`select(vec4<${t}>(0.0), ${e}, ${e} > vec4<${t}>(0.0))`))},Fi=e=>{e.compute($(e.inputs[0],`Sigmoid`,e=>`(1.0 / (1.0 + exp(-${e})))`))},Ii=e=>V(e),Li=(e,t)=>{let n=On(e.inputs[0].dataType);e.compute($(e.inputs[0],`HardSigmoid`,e=>`max(vec4<${n}>(0.0), min(vec4<${n}>(1.0), ${t.alpha} * ${e} + vec4<${n}>(${t.beta})))`,void 0,t.cacheKey))},Ri=e=>{e.compute($(e.inputs[0],`Sin`,`sin`))},zi=e=>{e.compute($(e.inputs[0],`Sinh`,`sinh`))},Bi=e=>{e.compute($(e.inputs[0],`Sqrt`,`sqrt`))},Vi=e=>{e.compute($(e.inputs[0],`Tan`,`tan`))},Hi=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,Ui=e=>{e.compute($(e.inputs[0],`Tanh`,Hi))},Wi=(e=`f32`)=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${Hi(`v`)};
}
`,Gi=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,Ki=e=>{let t=On(e.inputs[0].dataType);e.compute($(e.inputs[0],`FastGelu`,Gi,Wi(t),void 0,e.inputs[0].dataType))},qi=(e,t)=>{let n=On(e.inputs[0].dataType);return e.compute($(e.inputs[0],`ThresholdedRelu`,e=>`select(vec4<${n}>(0.0), ${e}, ${e} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${n}>(${t.alpha});`,t.cacheKey)),0},Ji=e=>{e.compute($(e.inputs[0],`Log`,`log`))},Yi=(e,t)=>`
const alpha = vec4<${e}>(${t});
const one = ${e}(1.0);
const zero = ${e}(0.0);

fn quick_gelu_impl(x: vec4<${e}>) -> vec4<${e}> {
  let v = x *alpha;
  var x1 : vec4<${e}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,Xi=e=>`quick_gelu_impl(${e})`,Zi=(e,t)=>{let n=On(e.inputs[0].dataType);e.compute($(e.inputs[0],`QuickGelu`,Xi,Yi(n,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),$i,ea,ta,na=d(()=>{B(),Y(),Qi(),$i=e=>{if(e[0].dims.length!==3)throw Error(`input should have 3 dimensions`);if(![2560,5120,10240].includes(e[0].dims[2]))throw Error(`hidden state should be 2560, 5120 or 10240`);if(e[1].dims.length!==1)throw Error(`bias is expected to have 1 dimensions`);if(e[0].dims[2]!==e[1].dims[0])throw Error(`last dimension of input and bias are not the same`)},ea=e=>{let t=e[0].dims.slice();t[2]/=2;let n=q(`input`,e[0].dataType,e[0].dims,4),r=q(`bias`,e[0].dataType,[e[0].dims[2]],4),i=J(`output`,e[0].dataType,t,4),a=z.size(t)/4,o=U(e[0].dataType);return{name:`BiasSplitGelu`,getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)}}),getShaderSource:t=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${t.declareVariables(n,r,i)}

  ${Ti(o)}

  ${t.mainStart()}
    ${t.guardAgainstOutOfBoundsWorkgroupSizes(a)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${i.setByOffset(`global_idx`,`valueLeft * geluRight`)}
  }`}},ta=e=>{$i(e.inputs),e.compute(ea(e.inputs))}}),ra,ia,aa,oa,sa,ca,la,ua,da,fa,pa,ma,ha,ga=d(()=>{L(),B(),Y(),ra=(e,t,n,r,i,a,o,s,c,l,u,d)=>{let f,p;typeof s==`string`?f=p=(e,t)=>`${s}((${e}),(${t}))`:typeof s==`function`?f=p=s:(f=s.scalar,p=s.vector);let m=J(`outputData`,u,r.length,4),h=q(`aData`,c,t.length,4),g=q(`bData`,l,n.length,4),_;if(i){if(a){let e=z.size(t)===1,r=z.size(n)===1,i=t.length>0&&t[t.length-1]%4==0,a=n.length>0&&n[n.length-1]%4==0;_=e||r?m.setByOffset(`global_idx`,p(e?`${h.type.value}(${h.getByOffset(`0`)}.x)`:h.getByOffset(`global_idx`),r?`${g.type.value}(${g.getByOffset(`0`)}.x)`:g.getByOffset(`global_idx`))):`
            let outputIndices = ${m.offsetToIndices(`global_idx * 4u`)};
            let offsetA = ${h.broadcastedIndicesToOffset(`outputIndices`,m)};
            let offsetB = ${g.broadcastedIndicesToOffset(`outputIndices`,m)};
            ${m.setByOffset(`global_idx`,p(o||i?h.getByOffset(`offsetA / 4u`):`${h.type.value}(${h.getByOffset(`offsetA / 4u`)}[offsetA % 4u])`,o||a?g.getByOffset(`offsetB / 4u`):`${g.type.value}(${g.getByOffset(`offsetB / 4u`)}[offsetB % 4u])`))}
          `}else _=m.setByOffset(`global_idx`,p(h.getByOffset(`global_idx`),g.getByOffset(`global_idx`)))}else{if(!a)throw Error(`no necessary to use scalar implementation for element-wise binary op implementation.`);let e=(e,t,n=``)=>{let r=`aData[indexA${t}][componentA${t}]`,i=`bData[indexB${t}][componentB${t}]`;return`
            let outputIndices${t} = ${m.offsetToIndices(`global_idx * 4u + ${t}u`)};
            let offsetA${t} = ${h.broadcastedIndicesToOffset(`outputIndices${t}`,m)};
            let offsetB${t} = ${g.broadcastedIndicesToOffset(`outputIndices${t}`,m)};
            let indexA${t} = offsetA${t} / 4u;
            let indexB${t} = offsetB${t} / 4u;
            let componentA${t} = offsetA${t} % 4u;
            let componentB${t} = offsetB${t} % 4u;
            ${e}[${t}] = ${n}(${f(r,i)});
          `};_=u===9?`
            var data = vec4<u32>(0);
            ${e(`data`,0,`u32`)}
            ${e(`data`,1,`u32`)}
            ${e(`data`,2,`u32`)}
            ${e(`data`,3,`u32`)}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:`
            ${e(`outputData[global_idx]`,0)}
            ${e(`outputData[global_idx]`,1)}
            ${e(`outputData[global_idx]`,2)}
            ${e(`outputData[global_idx]`,3)}
          `}return`
        ${e.registerUniform(`vec_size`,`u32`).declareVariables(h,g,m)}

        ${d??``}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.vec_size`)}
        ${_}
      }`},ia=(e,t,n,r,i,a,o=n.dataType)=>{let s=n.dims.map(Number),c=r.dims.map(Number),l=!z.areEqual(s,c),u=s,d=z.size(s),f=!1,p=!1,m=[l];if(l){let e=Wt.calcShape(s,c,!1);if(!e)throw Error(`Can't perform binary op on the given tensors`);u=e.slice(),d=z.size(u);let t=z.size(s)===1,n=z.size(c)===1,r=s.length>0&&s[s.length-1]%4==0,i=c.length>0&&c[c.length-1]%4==0;m.push(t),m.push(n),m.push(r),m.push(i);let a=1;for(let e=1;e<u.length;e++){let t=s[s.length-e];if(t===c[c.length-e])a*=t;else break}a%4==0?(p=!0,f=!0):(t||n||r||i)&&(f=!0)}else f=!0;return m.push(f),{name:e,shaderCache:{hint:t+m.map(e=>e.toString()).join(`_`),inputDependencies:[`rank`,`rank`]},getShaderSource:e=>ra(e,s,c,u,f,l,p,i,n.dataType,r.dataType,o,a),getRunData:()=>({outputs:[{dims:u,dataType:o}],dispatchGroup:{x:Math.ceil(d/64/4)},programUniforms:[{type:12,data:Math.ceil(z.size(u)/4)},...W(s,c,u)]})}},aa=(e,t,n,r,i,a)=>{e.compute(ia(t,i??``,e.inputs[0],e.inputs[1],n,r,a))},oa=e=>{aa(e,`Add`,(e,t)=>`${e}+${t}`)},sa=e=>{aa(e,`Div`,(e,t)=>`${e}/${t}`)},ca=e=>{aa(e,`Equal`,{scalar:(e,t)=>`u32(${e}==${t})`,vector:(e,t)=>`vec4<u32>(${e}==${t})`},void 0,void 0,9)},la=e=>{aa(e,`Mul`,(e,t)=>`${e}*${t}`)},ua=e=>{let t=q(`input`,e.inputs[0].dataType,e.inputs[0].dims).type.value;aa(e,`Pow`,{scalar:(e,t)=>`pow_custom(${e},${t})`,vector:(e,t)=>`pow_vector_custom(${e},${t})`},`
    fn pow_custom(a : ${t}, b : ${t}) -> ${t} {
      if (b == ${t}(0.0)) {
        return ${t}(1.0);
      } else if (a < ${t}(0.0) && f32(b) != floor(f32(b))) {
        return ${t}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${t}(1.0), round(f32(abs(b) % ${t}(2.0))) != 1.0) * ${t}(${t===`i32`?`round`:``}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${t}>, b : vec4<${t}>) -> vec4<${t}> {
      // TODO: implement vectorized pow
      return vec4<${t}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},da=e=>{aa(e,`Sub`,(e,t)=>`${e}-${t}`)},fa=e=>{aa(e,`Greater`,{scalar:(e,t)=>`u32(${e}>${t})`,vector:(e,t)=>`vec4<u32>(${e}>${t})`},void 0,void 0,9)},pa=e=>{aa(e,`Less`,{scalar:(e,t)=>`u32(${e}<${t})`,vector:(e,t)=>`vec4<u32>(${e}<${t})`},void 0,void 0,9)},ma=e=>{aa(e,`GreaterOrEqual`,{scalar:(e,t)=>`u32(${e}>=${t})`,vector:(e,t)=>`vec4<u32>(${e}>=${t})`},void 0,void 0,9)},ha=e=>{aa(e,`LessOrEqual`,{scalar:(e,t)=>`u32(${e}<=${t})`,vector:(e,t)=>`vec4<u32>(${e}<=${t})`},void 0,void 0,9)}}),_a,va,ya,ba,xa,Sa,Ca=d(()=>{L(),B(),H(),Y(),_a=(e,t)=>{if(!e||e.length<1)throw Error(`too few inputs`);let n=e[0],r=n.dataType,i=n.dims.length;e.forEach((e,a)=>{if(a!==0){if(e.dataType!==r)throw Error(`input tensors should be one type`);if(e.dims.length!==i)throw Error(`input tensors should have the same shape`);e.dims.forEach((e,r)=>{if(r!==t&&e!==n.dims[r])throw Error(`non concat dimensions must match`)})}})},va=(e,t)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${e}u>(${t});
    for (var i: u32 = 0u; i < ${e}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${e}u;
  }`,ya=(e,t)=>{let n=e.length,r=[];for(let i=0;i<n;++i){let a=t.setByOffset(`global_idx`,e[i].getByIndices(`indices`));n===1?r.push(a):i===0?r.push(`if (inputIndex == ${i}u) { ${a} }`):i===n-1?r.push(`else { ${a} }`):r.push(`else if (inputIndex == ${i}) { ${a} }`)}return r.join(`
`)},ba=(e,t,n,r)=>{let i=z.size(n),a=Array(e.length),o=Array(e.length),s=0,c=[],l=[],u=[{type:12,data:i}];for(let n=0;n<e.length;++n)s+=e[n].dims[t],a[n]=s,l.push(e[n].dims.length),o[n]=q(`input${n}`,r,l[n]),c.push(`rank`),u.push({type:12,data:a[n]});for(let t=0;t<e.length;++t)u.push(...W(e[t].dims));u.push(...W(n));let d=J(`output`,r,n.length),f=d.indicesGet(`indices`,t),p=Array.from(Array(a.length).keys()).map(e=>`uniforms.sizeInConcatAxis${e}`).join(`,`);return{name:`Concat`,shaderCache:{hint:`${t}`,inputDependencies:c},getRunData:()=>({outputs:[{dims:n,dataType:r}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:u}),getShaderSource:t=>`

  ${(()=>{t.registerUniform(`outputSize`,`u32`);for(let n=0;n<e.length;n++)t.registerUniform(`sizeInConcatAxis${n}`,`u32`);return t.declareVariables(...o,d)})()}

  ${va(a.length,p)}

  ${t.mainStart()}
    ${t.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}

    var indices = ${d.offsetToIndices(`global_idx`)};

    let inputIndex = calculateInputIndex(${f});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${a.length}u>(${p});
      ${f} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${ya(o,d)}
  }`}},xa=(e,t)=>{let n=e.inputs,r=n[0].dims,i=z.normalizeAxis(t.axis,r.length);_a(n,i);let a=r.slice();a[i]=n.reduce((e,t)=>e+(t.dims.length>i?t.dims[i]:0),0);let o=n.filter(e=>z.size(e.dims)>0);e.compute(ba(o,i,a,n[0].dataType),{inputs:o})},Sa=e=>V({axis:e.axis})}),wa,Ta,Ea,Da,Oa=d(()=>{L(),B(),wa=(e,t,n=`f32`)=>{switch(e.activation){case`Relu`:return`value = max(value, ${t}(0.0));`;case`Sigmoid`:return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case`Clip`:return`value = clamp(value, ${t}(${n}(uniforms.clip_min)), ${t}(${n}(uniforms.clip_max)));`;case`HardSigmoid`:return`value = max(${t}(0.0), min(${t}(1.0), ${n}(uniforms.alpha) * value + ${n}(uniforms.beta)));`;case`LeakyRelu`:return`value = select(${n}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case`Tanh`:return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case``:return``;default:throw Error(`Unsupported activation ${e.activation}`)}},Ta=(e,t)=>{e.activation===`Clip`?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation===`HardSigmoid`?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation===`LeakyRelu`&&t.push({type:1,data:e.alpha})},Ea=(e,t)=>{e.activation===`Clip`?t.push({name:`clip_max`,type:`f32`},{name:`clip_min`,type:`f32`}):e.activation===`HardSigmoid`?t.push({name:`alpha`,type:`f32`},{name:`beta`,type:`f32`}):e.activation===`LeakyRelu`&&t.push({name:`alpha`,type:`f32`})},Da=e=>{let t=e?.activation||``;if(t===`HardSigmoid`){let[n,r]=e?.activation_params||[.2,.5];return{activation:t,alpha:n,beta:r}}if(t===`Clip`){let[n,r]=e?.activation_params||[qt,Jt];return{activation:t,clipMax:r,clipMin:n}}if(t===`LeakyRelu`){let[n]=e?.activation_params||[.01];return{activation:t,alpha:n}}return{activation:t}}}),ka,Aa,ja=d(()=>{ka=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw Error(`${e}-component is not supported.`)}},Aa=e=>`
      ${e?`value = value + getBiasByOutputCoords(coords);`:``}
      `}),Ma,Na=d(()=>{Ma=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),Pa,Fa,Ia=d(()=>{L(),B(),Y(),Oa(),Pa=(e,t,n,r,i)=>{let a=r-n;return`
      ${Array.from({length:n}).map((n,o)=>`
      if (${K(t.shape,o,t.rank)} != 1) {
        ${t.indicesSet(e,o,K(i,o+a,r))}
      } else {
        ${t.indicesSet(e,o,0)}
      }`).join(``)}
`},Fa=(e,t,n,r,i=!1,a)=>{let o=e[0].dims,s=e[1].dims,c=o[o.length-2],l=s[s.length-1],u=o[o.length-1],d=G(l),f=G(u),p=G(c),m=z.size(n)/d/p,h=e.length>2,g=r?r.slice(0,-2):n.slice(0,-2),_=[z.size(g),c,l],v=[{type:12,data:m},{type:12,data:c},{type:12,data:l},{type:12,data:u}];return Ta(t,v),v.push(...W(g,o,s)),h&&v.push(...W(e[2].dims)),v.push(...W(_)),{name:`MatMulNaive`,shaderCache:{hint:`${t.activation};${d};${f};${p};${i}`,inputDependencies:h?[`rank`,`rank`,`rank`]:[`rank`,`rank`]},getRunData:()=>({outputs:[{dims:a?a(n):n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:v}),getShaderSource:r=>{let a=Pn(`batch_dims`,e[0].dataType,g.length),c=q(`a`,e[0].dataType,o.length,f),l=q(`b`,e[1].dataType,s.length,d),u=J(`output`,e[0].dataType,_.length,d),m=U(u.type.tensor),v=wa(t,u.type.value,m),y=[c,l],b=``;if(h){let t=i?d:1;y.push(q(`bias`,e[2].dataType,e[2].dims.length,t)),b=`${i?`value += bias[col / ${t}];`:`value += ${u.type.value}(bias[row + i]);`}`}let x=[{name:`output_size`,type:`u32`},{name:`M`,type:`u32`},{name:`N`,type:`u32`},{name:`K`,type:`u32`}];Ea(t,x);let S=()=>{let e=`var a_data: ${c.type.value};`;for(let t=0;t<f;t++)e+=`
              let b_data${t} = b[(b_offset + (k + ${t}) * uniforms.N + col) / ${d}];`;for(let t=0;t<p;t++){e+=`a_data = a[(a_offset + (row + ${t}) * uniforms.K + k) / ${f}];`;for(let n=0;n<f;n++)e+=`
            values[${t}] = fma(${l.type.value}(a_data${f===1?``:`[${n}]`}), b_data${n}, values[${t}]);
`}return e};return`
  ${r.registerUniforms(x).registerInternalVariables(a).declareVariables(...y,u)}
  ${r.mainStart()}
    ${r.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
    let col = (global_idx % (uniforms.N / ${d})) * ${d};
    var index1 = global_idx / (uniforms.N / ${d});
    let stride1 = uniforms.M / ${p};
    let row = (index1 % stride1) * ${p};
    let batch = index1 / stride1;

    ${n.length===2?``:`let batch_indices = ${a.offsetToIndices(`batch`)};`}

    var a_indices: ${c.type.indices};
    ${Pa(`a_indices`,c,c.rank-2,a.rank,`batch_indices`)}
    ${c.indicesSet(`a_indices`,c.rank-2,0)}
    ${c.indicesSet(`a_indices`,c.rank-1,0)}
    let a_offset = ${c.indicesToOffset(`a_indices`)};

    var b_indices: ${l.type.indices};
    ${Pa(`b_indices`,l,l.rank-2,a.rank,`batch_indices`)}
    ${l.indicesSet(`b_indices`,l.rank-2,0)}
    ${l.indicesSet(`b_indices`,l.rank-1,0)}
    let b_offset = ${l.indicesToOffset(`b_indices`)};
    var values: array<${u.type.value}, ${p}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${f}) {
      ${S()}
    }
    for (var i = 0u; i < ${p}u; i++) {
      var value = values[i];
      ${b}
      ${v}
      let cur_indices = ${u.type.indices}(batch, row + i, col);
      let offset = ${u.indicesToOffset(`cur_indices`)};
      ${u.setByOffset(`offset / ${d}`,`value`)};
    }
  }
  `}}}}),La,Ra,za,Ba,Va,Ha,Ua,Wa,Ga=d(()=>{L(),B(),Y(),Oa(),Ia(),ja(),La=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?`, batchIndices`:``});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?`, batchIndices`:``});
        `,Ra=(e,t)=>e?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${t===3?``:`let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];`}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${t===3?``:`acc[i] = BCached3 * ACached3[i] + acc[i];`}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${t===3?``:`acc[i] = BCached3 * ACached.w + acc[i];`}
        }`,za=(e,t,n=`f32`,r,i=!1,a=32,o=!1,s=32)=>{let c=t[1]*e[1],l=t[0]*e[0],u=i?c:a,d=i?a:c,f=u/t[0],p=a/t[1];if(!((i&&f===4&&e[1]===4||!i&&(f===3||f===4))&&u%t[0]===0&&a%t[1]===0&&e[0]===4))throw Error(`If transposeA ${i} is true, innerElementSize ${f} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${f} must be 3 or 4.
  tileAWidth ${u} must be divisible by workgroupSize[0]${t[0]}. tileInner ${a} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${f}<${n}>, ${u/f}>, ${d}>;
var<workgroup> mm_Bsub: array<array<vec4<${n}>, ${l/e[0]}>, ${a}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${f};
const tileInner = ${a};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${o?`0`:`i32(globalId.z)`};
  ${r?`let batchIndices = ${r.offsetToIndices(`u32(batch)`)};`:``}
  let globalRowStart = i32(workgroupId.y) * ${c};

  let num_tiles = ${o?`${Math.ceil(s/a)}`:`(uniforms.dim_inner - 1) / tileInner + 1`};
  var kStart = ${o?`i32(globalId.z) * ${s}`:`0`};

  var acc: array<vec4<${n}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${p};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${La(i,r)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${p}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${r?`, batchIndices`:``});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${f===3?``:`let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];`}

          ${Ra(i,f)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},Ba=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?`, batchIndices`:``});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?`, batchIndices`:``});
            `,Va=e=>e?`let ACached = mm_Asub[k][tileRow + innerRow];`:`let ACached = mm_Asub[tileRow + innerRow][k];`,Ha=(e,t,n=`f32`,r,i=!1,a=32,o=!1,s=32,c=!1)=>{let l=e[1]*t[1],u=e[0]*t[0],d=i?l:a,f=i?a:l;if(f%t[1]!==0||d%t[0]!==0||a%t[1]!==0)throw Error(`tileAHight ${f} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${d} must be divisible by workgroupSize[0]${t[0]}, tileInner ${a} must be divisible by workgroupSize[1]${t[1]}`);let p=f/t[1],m=d/t[0],h=a/t[1],g=c?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${l};
    let globalColStart = i32(workgroupId.x) * ${u};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${f}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${d}; inputCol = inputCol + ${t[0]}) {
          ${Ba(i,r)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${a}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${u}; inputCol = inputCol + ${t[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${r?`, batchIndices`:``});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${n}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${i?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${t[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${t[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${l};

let tileRowA = i32(localId.y) * ${p};
let tileColA = i32(localId.x) * ${m};
let tileRowB = i32(localId.y) * ${h};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${p}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${m}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${Ba(i,r)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${h}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${r?`, batchIndices`:``});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${n}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${Va(i)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;return`
  var<workgroup> mm_Asub : array<array<${n}, ${d}>, ${f}>;
  var<workgroup> mm_Bsub : array<array<${n}, ${u}>, ${a}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${a};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${o?`0`:`i32(globalId.z)`};
    ${r?`let batchIndices = ${r.offsetToIndices(`u32(batch)`)};`:``}
    let num_tiles = ${o?`${Math.ceil(s/a)}`:`(uniforms.dim_inner - 1) / tileInner + 1`};
    var kStart = ${o?`i32(globalId.z) * ${s}`:`0`};

    var acc : array<array<${n}, colPerThread>, rowPerThread>;
    ${g}
  }
`},Ua=(e,t,n,r,i=!1)=>{let[a,o,s,c]=r,l=U(r[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${a.type.indices}) -> ${ka(e,l)} {
      var value = ${ka(e,l)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${o.type.indices};
        ${Pa(`aIndices`,o,o.rank-2,a.rank,`batchIndices`)}
        ${o.indicesSet(`aIndices`,o.rank-2,`u32(row)`)}
        ${o.indicesSet(`aIndices`,o.rank-1,`u32(colIn)`)}
        value = ${o.getByIndices(`aIndices`)};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${a.type.indices}) -> ${ka(e,l)} {
      var value = ${ka(e,l)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${s.type.indices};
        ${Pa(`bIndices`,s,s.rank-2,a.rank,`batchIndices`)}
        ${s.indicesSet(`bIndices`,s.rank-2,`u32(row)`)}
        ${s.indicesSet(`bIndices`,s.rank-1,`u32(colIn)`)}
        value = ${s.getByIndices(`bIndices`)};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${ka(e,l)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${i?`bias[colIn]`:`${ka(e,l)}(bias[row])`};`:``}
        ${n}
        ${c.setByIndices(`vec3<u32>(coords)`,`value`)}
      }
    }
    `},Wa=(e,t,n,r,i=!1,a)=>{let o=e[0].dims,s=e[1].dims,c=o.slice(0,-2),l=s.slice(0,-2),u=r?r.slice(0,-2):n.slice(0,-2),d=z.size(u),f=o[o.length-2],p=o[o.length-1],m=s[s.length-1],h=p%4==0&&m%4==0,g=f<=8?[4,1,1]:[4,4,1],_=[8,8,1],v=[Math.ceil(m/_[0]/g[0]),Math.ceil(f/_[1]/g[1]),Math.ceil(d/_[2]/g[2])],y=h?4:1,b=[...c,f,p/y],x=b.length,S=[...l,p,m/y],C=S.length,w=[d,f,m/y],T=[{type:6,data:f},{type:6,data:m},{type:6,data:p}];Ta(t,T),T.push(...W(u,b,S));let E=[`rank`,`rank`],D=e.length>2;return D&&(T.push(...W(e[2].dims)),E.push(`rank`)),T.push(...W(w)),{name:`MatMul`,shaderCache:{hint:`${g};${t.activation};${h};${i}`,inputDependencies:E},getRunData:()=>({outputs:[{dims:a?a(n):n,dataType:e[0].dataType}],dispatchGroup:{x:v[0],y:v[1],z:v[2]},programUniforms:T}),getShaderSource:n=>{let r=u.length,a=Pn(`batchDims`,e[0].dataType,r,1),o=U(e[0].dataType),s=q(`a`,e[0].dataType,x,y),c=q(`b`,e[1].dataType,C,y),l=J(`result`,e[0].dataType,w.length,y),d=[s,c];if(D){let t=i?y:1;d.push(q(`bias`,e[2].dataType,e[2].dims.length,t))}let f=[{name:`dim_a_outer`,type:`i32`},{name:`dim_b_outer`,type:`i32`},{name:`dim_inner`,type:`i32`}];Ea(t,f);let p=U(l.type.tensor),m=wa(t,l.type.value,p),v=Ua(y,D,m,[a,s,c,l],i);return`
  ${n.registerUniforms(f).registerInternalVariables(a).declareVariables(...d,l)}
  ${v}
  ${h?za(g,_,o,a):Ha(g,_,o,a)}
                   `}}}}),Ka,qa,Ja=d(()=>{L(),Ht(),Y(),Oa(),ja(),Na(),Ga(),Ka=(e,t,n,r,i=!1,a,o=4,s=4,c=4,l=`f32`)=>{let u=e=>{switch(e){case 1:return`resData = x[xIndex];`;case 3:return`resData = vec3<${l}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return`resData = x[xIndex / 4];`;default:throw Error(`innerElementSize ${e} is not supported.`)}},d=e=>{switch(e){case 1:return`return w[row * i32(uniforms.w_shape[3]) + colIn];`;case 4:return`return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];`;default:throw Error(`innerElementSize ${e} is not supported.`)}},f=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,p=e?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,m=e?`i32(uniforms.x_shape[1])`:`i32(uniforms.x_shape[2])`,h=e?`i32(uniforms.x_shape[2])`:`i32(uniforms.x_shape[3])`,g=e?`row`:`col`,_=e?`col`:`row`,v=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?`i32(uniforms.result_shape[2])`:`i32(uniforms.result_shape[3])`};
    let outRow = ${g} / outWidth;
    let outCol = ${g} % outWidth;

    let WRow = ${_} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${_} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${_} % inChannels;
    var resData = ${ka(o,l)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${m} && xCol >= 0 && xCol < ${h}) {
      ${f}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${u(o)}
    }
    return resData;`,y=e?t&&r?`
    let col = colIn * ${o};
    ${v}`:`
    let col = colIn * ${o};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${v}
    }
    return ${ka(o,l)}(0.0);`:r&&n?`
    let col = colIn * ${o};
    ${v}`:`
    let col = colIn * ${o};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${v}
    }
    return ${ka(o,l)}(0.0);`,b=e?r&&n?d(s):`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${d(s)}
    }
    return ${ka(s,l)}(0.0);`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${d(s)}
    }
    return ${ka(s,l)}(0.0);`,x=ka(c,l),S=ka(e?o:s,l),C=ka(e?s:o,l),w=wa(a,x,l);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${S} {
      ${e?y:b}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${C} {
      ${e?b:y}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${x}) {
      let col = colIn * ${c};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?`i32(uniforms.result_shape[2])`:`i32(uniforms.result_shape[3])`};
      ${p}
      ${Aa(i)}
      ${w}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},qa=(e,t,n,r,i,a,o,s,c)=>{let l=t.format===`NHWC`,u=l?e[0].dims[3]:e[0].dims[1],d=n[0],f=l?n[2]:n[3],p=l?n[1]:n[2],m=l?n[3]:n[1],h=l&&(u%4==0||u%3==0)&&m%4==0,g=l?m:f*p,_=l?f*p:m,v=[8,8,1],y=r<=8?[4,1,1]:[4,4,1],b=[Math.ceil(g/v[0]/y[0]),Math.ceil(_/v[1]/y[1]),Math.ceil(d/v[2]/y[2])];R(`verbose`,()=>`[conv2d_mm_webgpu] dispatch = ${b}`);let x=h?l&&u%4!=0?3:4:1,S=v[1]*y[1],C=v[0]*y[0],w=Math.max(v[0]*x,v[1]),T=r%S===0,E=i%C===0,D=a%w===0,O=h?[x,4,4]:[1,1,1],k=[{type:6,data:r},{type:6,data:i},{type:6,data:a},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];Ta(t,k),k.push(...W(e[0].dims,e[1].dims));let A=[`rank`,`rank`];return o&&(k.push(...W(e[2].dims)),A.push(`rank`)),k.push(...W(n)),{name:`Conv2DMatMul`,shaderCache:{hint:`${t.cacheKey};${x};${h};${T};${E};${D};${S};${C};${w}`,inputDependencies:A},getRunData:()=>({outputs:[{dims:c?c(n):n,dataType:e[0].dataType}],dispatchGroup:{x:b[0],y:b[1],z:b[2]},programUniforms:k}),getShaderSource:r=>{let i=[{name:`dim_a_outer`,type:`i32`},{name:`dim_b_outer`,type:`i32`},{name:`dim_inner`,type:`i32`},{name:`pad`,type:`i32`,length:2},{name:`stride`,type:`i32`,length:2},{name:`dilation`,type:`i32`,length:2}];Ea(t,i);let a=h?4:1,c=U(e[0].dataType),u=`
      fn setOutputAtIndex(flatIndex : i32, value : ${h?`vec4<${c}>`:c}) {
        result[flatIndex] = ${h?`vec4<${c}>`:c}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${h?`vec4<${c}>`:c}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${h?`/ 4`:``}, value);
      }`,d=[q(`x`,e[0].dataType,e[0].dims.length,x===3?1:x),q(`w`,e[1].dataType,e[1].dims.length,a)],f=J(`result`,e[0].dataType,n.length,a);if(o){let t=q(`bias`,e[2].dataType,e[2].dims.length,a);d.push(t),u+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${h?`vec4<${c}>`:c} {
          return bias[coords.${l?`w`:`y`}${h?`/ 4`:``}];
        }`}return`
        ${Ma(`uniforms.result_strides`)}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${r.registerUniforms(i).declareVariables(...d,f)}
        ${u}
        ${Ka(l,T,E,D,o,t,O[0],O[1],O[2],c)}
        ${h?za(y,v,c,void 0,!l,w):Ha(y,v,c,void 0,!l,w,!1,void 0,s)}`}}}}),Ya,Xa,Za,Qa,$a,eo,to,no,ro=d(()=>{L(),Ht(),B(),Y(),Oa(),ja(),Ya=e=>{let t=1;for(let n=0;n<e.length;n++)t*=e[n];return t},Xa=e=>typeof e==`number`?[e,e,e]:e,Za=(e,t)=>t<=1?e:e+(e-1)*(t-1),Qa=(e,t,n,r=1)=>{let i=Za(t,r);return Math.floor((e[0]*(n-1)-n+i)/2)},$a=(e,t,n,r,i)=>{i??=Qa(e,t[0],r[0]);let a=[0,0,0,n];for(let n=0;n<3;n++)e[n]+2*i>=t[n]&&(a[n]=Math.trunc((e[n]-t[n]+2*i)/r[n]+1));return a},eo=(e,t,n,r,i,a,o,s,c,l)=>{let u,d,f,p;if(e===`VALID`&&(e=0),typeof e==`number`){u={top:e,bottom:e,left:e,right:e,front:e,back:e};let m=$a([t,n,r,1],[s,c,l],1,[i,a,o],e);d=m[0],f=m[1],p=m[2]}else if(Array.isArray(e)){if(!e.every((e,t,n)=>e===n[0]))throw Error(`Unsupported padding parameter: ${e}`);u={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let m=$a([t,n,r,1],[s,c,l],1,[i,a,o],e[0]);d=m[0],f=m[1],p=m[2]}else if(e===`SAME_UPPER`){d=Math.ceil(t/i),f=Math.ceil(n/a),p=Math.ceil(r/o);let e=(d-1)*i+s-t,m=(f-1)*a+c-n,h=(p-1)*o+l-r,g=Math.floor(e/2),_=e-g,v=Math.floor(m/2),y=m-v,b=Math.floor(h/2);u={top:v,bottom:y,left:b,right:h-b,front:g,back:_}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:u,outDepth:d,outHeight:f,outWidth:p}},to=(e,t,n,r,i,a=!1,o=`channelsLast`)=>{let s,c,l,u,d;if(o===`channelsLast`)[s,c,l,u,d]=e;else if(o===`channelsFirst`)[s,d,c,l,u]=e;else throw Error(`Unknown dataFormat ${o}`);let[f,,p,m,h]=t,[g,_,v]=Xa(n),[y,b,x]=Xa(r),S=Za(p,y),C=Za(m,b),w=Za(h,x),{padInfo:T,outDepth:E,outHeight:D,outWidth:O}=eo(i,c,l,u,g,_,v,S,C,w),k=a?f*d:f,A=[0,0,0,0,0];return o===`channelsFirst`?A=[s,k,E,D,O]:o===`channelsLast`&&(A=[s,E,D,O,k]),{batchSize:s,dataFormat:o,inDepth:c,inHeight:l,inWidth:u,inChannels:d,outDepth:E,outHeight:D,outWidth:O,outChannels:k,padInfo:T,strideDepth:g,strideHeight:_,strideWidth:v,filterDepth:p,filterHeight:m,filterWidth:h,effectiveFilterDepth:S,effectiveFilterHeight:C,effectiveFilterWidth:w,dilationDepth:y,dilationHeight:b,dilationWidth:x,inShape:e,outShape:A,filterShape:t}},no=(e,t,n,r,i,a)=>{let o=a===`channelsLast`;o?e[0].dims[3]:e[0].dims[1];let s=[64,1,1],c={x:n.map((e,t)=>t)},l=[Math.ceil(Ya(c.x.map(e=>n[e]))/s[0]),1,1];R(`verbose`,()=>`[conv3d_naive_webgpu] dispatch = ${l}`);let u=[{type:12,data:z.size(n)},{type:12,data:r},{type:12,data:i},{type:12,data:t.strides},{type:12,data:t.dilations}];Ta(t,u),u.push(...W(e[0].dims,e[1].dims));let d=[`rank`,`rank`],f=e.length===3;return f&&(u.push(...W(e[2].dims)),d.push(`rank`)),u.push(...W(n)),{name:`Conv3DNaive`,shaderCache:{hint:`${t.cacheKey};${o};1;${f}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:l[0],y:l[1],z:l[2]},programUniforms:u}),getShaderSource:a=>{let s=[{name:`output_size`,type:`u32`},{name:`filter_dims`,type:`u32`,length:r.length},{name:`pads`,type:`u32`,length:i.length},{name:`strides`,type:`u32`,length:t.strides.length},{name:`dilations`,type:`u32`,length:t.dilations.length}];Ea(t,s);let c=U(e[0].dataType),l=q(`x`,e[0].dataType,e[0].dims.length,1),u=q(`W`,e[1].dataType,e[1].dims.length,1),d=[l,u],p=J(`result`,e[0].dataType,n.length,1),m=``;if(f){let t=q(`bias`,e[2].dataType,e[2].dims.length,1);d.push(t),m+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${c} {
          return bias[${o?K(`coords`,4,5):K(`coords`,1,5)}];
        }`}let h=ka(1,c),g=wa(t,h,c);return`
            ${m}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${l.getByIndices(`aIndices`)};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${u.getByIndices(`aIndices`)};
            }
          ${a.registerUniforms(s).declareVariables(...d,p)}
          ${a.mainStart()}
          ${a.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
              let coords = ${p.offsetToIndices(`global_idx`)};
              let batch = ${K(`coords`,0,l.rank)};
              let d2 = ${o?K(`coords`,l.rank-1,l.rank):K(`coords`,1,l.rank)};
              let xFRCCorner = vec3<u32>(${o?K(`coords`,1,l.rank):K(`coords`,2,l.rank)},
              ${o?K(`coords`,2,l.rank):K(`coords`,3,l.rank)},
              ${o?K(`coords`,3,l.rank):K(`coords`,4,l.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${o?K(`uniforms.x_shape`,1,l.rank):K(`uniforms.x_shape`,2,l.rank)};
              let xShapeZ = ${o?K(`uniforms.x_shape`,2,l.rank):K(`uniforms.x_shape`,3,l.rank)};
              let xShapeW = ${o?K(`uniforms.x_shape`,3,l.rank):K(`uniforms.x_shape`,4,l.rank)};
              let xShapeU = ${o?K(`uniforms.x_shape`,4,l.rank):K(`uniforms.x_shape`,1,l.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = 0.0;
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${o?`let xValues = vec4<f32>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<f32>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<f32>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${o?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${o?`let xValues = vec2<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${o?`let xValues = vec3<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${f?`value = value + getBiasByOutputCoords(coords)`:``};
              ${g}
              result[global_idx] = f32(value);
          }`}}}}),io,ao,oo=d(()=>{L(),B(),Y(),Oa(),io=(e,t,n,r)=>{let i=e.length>2,a=i?`value += b[output_channel];`:``,o=e[0].dims,s=e[1].dims,c=t.format===`NHWC`,l=c?n[3]:n[1],u=l/t.group,d=c&&u>=4?G(l):1,f=z.size(n)/d,p=[{type:12,data:f},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:u}];Ta(t,p),p.push(...W(o,[s[0],s[1],s[2],s[3]/d]));let m=i?[`rank`,`rank`,`rank`]:[`rank`,`rank`];return p.push(...W([n[0],n[1],n[2],n[3]/d])),{name:`GroupedConv`,shaderCache:{hint:`${t.cacheKey}_${d}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:r?r(n):n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:p}),getShaderSource:r=>{let l=J(`output`,e[0].dataType,n.length,d),u=U(l.type.tensor),f=wa(t,l.type.value,u),p=q(`x`,e[0].dataType,o.length),m=q(`w`,e[1].dataType,s.length,d),h=[p,m];i&&h.push(q(`b`,e[2].dataType,e[2].dims,d));let g=[{name:`output_size`,type:`u32`},{name:`dilations`,type:`u32`,length:t.dilations.length},{name:`strides`,type:`u32`,length:2},{name:`pads`,type:`u32`,length:2},{name:`output_channels_per_group`,type:`u32`}];Ea(t,g);let _=c?`
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${p.get(`batch`,`xHeight`,`xWidth`,`input_channel`)};
            let wVal = ${m.get(`wHeight`,`wWidth`,`wInChannel`,`output_channel`)};
            value += xVal * wVal;
          }
        }
      }
      `:`
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${p.get(`batch`,`input_channel`,`xHeight`,`xWidth`)};
            let wVal = ${m.get(`output_channel`,`wInChannel`,`wHeight`,`wWidth`)};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${r.registerUniforms(g).declareVariables(...h,l)}

  ${r.mainStart()}
    ${r.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}

    let outputIndices = ${l.offsetToIndices(`global_idx`)};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${c?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${c?1:2}], outputIndices[${c?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${d} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${c?2:1}];

    var value: ${l.type.value} = ${l.type.value}(0);
    ${_}
    ${a}
    ${f}
    ${l.setByOffset(`global_idx`,`value`)}
  }`}}},ao=(e,t,n,r)=>{let i=e.length>2,a=G(n[3]),o=G(n[2]),s=z.size(n)/a/o,c=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/a],l=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/a],u=[n[0],n[1],n[2],n[3]/a],d=[{type:12,data:s},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];Ta(t,d),d.push(...W(c,l,u));let f=(o-1)*t.strides[1]+l[1];return{name:`GroupedConv-Vectorize`,shaderCache:{hint:`${t.cacheKey};${a};${o};${f};${l[0]};${l[1]}`,inputDependencies:i?[`rank`,`rank`,`type`]:[`rank`,`rank`]},getRunData:()=>({outputs:[{dims:r?r(n):n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:d}),getShaderSource:n=>{let r=J(`output`,e[0].dataType,u.length,a),s=U(r.type.tensor),d=wa(t,r.type.value,s),p=q(`x`,e[0].dataType,c.length,a),m=q(`w`,e[1].dataType,l.length,a),h=[p,m];i&&h.push(q(`b`,e[2].dataType,e[2].dims,a));let g=i?`value += b[output_channel];`:``,_=[{name:`output_size`,type:`u32`},{name:`strides`,type:`i32`,length:2},{name:`pads`,type:`i32`,length:2}];return Ea(t,_),`
  ${n.registerUniforms(_).declareVariables(...h,r)}
  ${n.mainStart()}
    ${n.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${o}u;
    let col = (index1 % width1) * ${o}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${p.type.value}, ${f}>;
    var values: array<${r.type.value}, ${o}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${l[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${f}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${p.get(`batch`,`u32(x_height)`,`u32(x_width)`,`input_channel`)};
          } else {
            x_vals[i] = ${p.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${l[1]}; w_width++) {
          let w_val = ${m.get(`w_height`,`w_width`,`0`,`output_channel`)};
          for (var i = 0u; i < ${o}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${o}u; i++) {
      var value = values[i];
      ${g}
      ${d}
      ${r.set(`batch`,`row`,`col + i`,`output_channel`,`value`)};
    }
  }`}}}}),so,co,lo,uo,fo,po,mo,ho,go,_o=d(()=>{B(),Ja(),ro(),Ga(),oo(),Oa(),Ia(),Kn(),so=(e,t,n,r,i,a)=>{let o=e[0],s=e.slice(a?1:2,a?3:4),c=s.length,l=t[0],u=t.slice(2).map((e,t)=>e+(e-1)*(n[t]-1)),d=s.map((e,t)=>e+r[t]+r[t+c]).map((e,t)=>Math.floor((e-u[t]+i[t])/i[t]));return d.splice(0,0,o),d.splice(a?3:1,0,l),d},co=[2,3,1,0],lo=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw Error(`Conv requires 2 or 3 inputs`);if(e[0].dims.length>5)throw Error(`greater than 5D is not supported`);if(e[0].dims.length!==e[1].dims.length)throw Error(`filter does not have same dimension as input`);if(e[0].dims[t.format===`NHWC`?e[0].dims.length-1:1]!==e[1].dims[1]*t.group)throw Error(`FILTER_IN_CHANNEL should be equal to DATA_CHANNEL`);if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw Error(`invalid bias`);let n=e[0].dims.length-2;if(t.dilations.length!==n)throw Error(`dilations should be ${n}D`);if(t.strides.length!==n)throw Error(`strides should be ${n}D`);if(t.pads.length!==n*2)throw Error(`pads should be ${n*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw Error(`invalid kernel shape`)},uo=(e,t)=>{let n=e.kernelShape.slice();n.length<t[1].dims.length-2&&n.push(...Array(t[1].dims.length-2-n.length).fill(0));for(let e=2;e<t[1].dims.length;++e)n[e-2]===0&&(n[e-2]=t[1].dims[e]);let r=e.pads.slice();Gt.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,n,r,e.format===`NHWC`,e.autoPad);let i=Object.assign({},e);return Object.assign(i,{kernelShape:n,pads:r}),i},fo=e=>{let t=Da(e),n=e.format;return{autoPad:[`NOTSET`,`VALID`,`SAME_UPPER`,`SAME_LOWER`][e.auto_pad],format:n,dilations:e.dilations,group:e.group,kernelShape:e.kernel_shape,pads:e.pads,strides:e.strides,wIsConst:e.w_is_const(),...t,cacheKey:`${e.format};${t.activation};`}},po=(e,t,n,r)=>{let i=n.format===`NHWC`,a=so(t[0].dims,t[1].dims,n.dilations,n.pads,n.strides,i);if(n.group!==1){let o=[t[0]];if(i){let r=e.kernelCustomData.wT??e.compute(Un(t[1],co),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];n.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=r),o.push(r)}else o.push(t[1]);t.length===3&&o.push(t[2]),!e.adapterInfo.isArchitecture(`ampere`)&&i&&t[1].dims[0]===n.group&&t[1].dims[1]===1&&n.dilations[0]===1&&n.dilations[1]===1?e.compute(ao(o,n,a,r),{inputs:o}):e.compute(io(o,n,a,r),{inputs:o});return}let o=t.length===3,s=t[0].dims[i?1:2],c=t[0].dims[i?2:3],l=t[0].dims[i?3:1],u=t[1].dims[2],d=t[1].dims[3],f=a[i?1:2],p=a[i?2:3],m=a[i?3:1],h=i&&u===s&&d===c&&n.pads[0]===0&&n.pads[1]===0;if(h||u===1&&d===1&&n.dilations[0]===1&&n.dilations[1]===1&&n.strides[0]===1&&n.strides[1]===1&&n.pads[0]===0&&n.pads[1]===0){let u=a[0],d,g,_,v=[];if(i){let r=e.kernelCustomData.wT??e.compute(Un(t[1],co),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];if(n.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=r),h){let e=s*c*l;d=t[0].reshape([1,u,e]),g=r.reshape([1,e,m]),_=[1,u,m]}else d=t[0].reshape([u,s*c,l]),g=r.reshape([1,l,m]),_=[u,f*p,m];v.push(d),v.push(g)}else d=t[0].reshape([u,l,s*c]),g=t[1].reshape([1,m,l]),_=[u,m,f*p],v.push(g),v.push(d);o&&v.push(t[2]);let y=_[2],b=v[0].dims[v[0].dims.length-1];y<8&&b<8?e.compute(Fa(v,n,a,_,i,r),{inputs:v}):e.compute(Wa(v,n,a,_,i,r),{inputs:v});return}let g=e.kernelCustomData.wT??e.compute(Un(t[1],co),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];n.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=g);let _=[t[0],g];o&&_.push(t[2]);let v=i?f*p:m,y=i?m:f*p,b=u*d*l;e.compute(qa(_,n,a,v,y,b,o,!0,r),{inputs:_})},mo=(e,t)=>{let n=t.format===`NHWC`,r=[e.inputs[0].reshape(n?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&r.push(e.inputs[2]);let i=[0,t.pads[0],0,t.pads[1]],a=[1].concat(t.strides),o=[1].concat(t.dilations),s=[1].concat(t.kernelShape),c=uo({...t,pads:i,strides:a,dilations:o,kernelShape:s},r);po(e,r,c,e=>n?[e[0],e[2],e[3]]:[e[0],e[1],e[3]])},ho=(e,t,n)=>{let r=n.format===`NHWC`?`channelsLast`:`channelsFirst`,i=uo(n,t),a=n.autoPad===`NOTSET`?n.pads:n.autoPad,o=to(t[0].dims,t[1].dims,n.strides,n.dilations,a,!1,r);e.compute(no(t,i,o.outShape,[o.filterDepth,o.filterHeight,o.filterWidth],[o.padInfo.front,o.padInfo.top,o.padInfo.left],r))},go=(e,t)=>{if(lo(e.inputs,t),e.inputs[0].dims.length===3)mo(e,t);else if(e.inputs[0].dims.length===5)ho(e,e.inputs,t);else{let n=uo(t,e.inputs);po(e,e.inputs,n)}}}),vo,yo=d(()=>{L(),Ht(),B(),Y(),vo=(e,t,n)=>{let r=e.length>2,i=t.outputShape,a=t.format===`NHWC`,o=t.group,s=e[1].dims,c=s[2]/o,l=s[3],u=a?G(c):1,d=a&&l===1&&c>=4,f=d?Math.floor(c/4)*4:Math.floor(c/u)*u,p=c-f,m=a?G(l):1,h=a?l===1?u:m:1,g=z.size(i)/m,_=[Math.ceil(g/64),1,1];R(`verbose`,()=>`[conv2d_backprop_webgpu] dispatch = ${_}`);let v=[`rank`,`rank`],y=[t.strides[0],t.strides[1]],b=[t.kernelShape[a?1:2],t.kernelShape[a?2:3]],x=[t.dilations[0],t.dilations[1]],S=[b[0]+(t.dilations[0]<=1?0:(t.kernelShape[a?1:2]-1)*(t.dilations[0]-1)),b[1]+(t.dilations[1]<=1?0:(t.kernelShape[a?2:3]-1)*(t.dilations[1]-1))],C=[S[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),S[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],w=[{type:12,data:g},{type:12,data:y},{type:12,data:b},{type:12,data:x},{type:12,data:S},{type:6,data:C},{type:12,data:f},{type:12,data:c},{type:12,data:l},...W(e[0].dims,e[1].dims)];return r&&(w.push(...W(e[2].dims)),v.push(`rank`)),w.push(...W(i)),{name:`ConvTranspose2D`,shaderCache:{hint:`${t.cacheKey};${u}${h}${m}${d}${p}`,inputDependencies:v},getRunData:()=>({dispatchGroup:{x:_[0],y:_[1],z:_[2]},outputs:[{dims:n?n(i):i,dataType:e[0].dataType}],programUniforms:w}),getShaderSource:t=>{let n=[{name:`output_size`,type:`u32`},{name:`strides`,type:`u32`,length:y.length},{name:`filter_dims`,type:`u32`,length:b.length},{name:`dilations`,type:`u32`,length:b.length},{name:`effective_filter_dims`,type:`u32`,length:S.length},{name:`pads`,type:`i32`,length:C.length},{name:`input_channels_per_group_int`,type:`u32`},{name:`input_channels_per_group`,type:`u32`},{name:`output_channels_per_group`,type:`u32`}],o=U(e[0].dataType),s=a?1:2,c=a?2:3,l=a?3:1,f=q(`W`,e[1].dataType,e[1].dims.length,h),g=q(`Dy`,e[0].dataType,e[0].dims.length,u),_=[g,f];r&&_.push(q(`bias`,e[2].dataType,[i[l]].length,m));let v=J(`result`,e[0].dataType,i.length,m),x=`
            let outputIndices = ${v.offsetToIndices(`global_idx * ${m}`)};
            let batch = ${v.indicesGet(`outputIndices`,0)};
            let d1 = ${v.indicesGet(`outputIndices`,l)};
            let r = ${v.indicesGet(`outputIndices`,s)};
            let c = ${v.indicesGet(`outputIndices`,c)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${v.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${o}(dyRCorner) + ${o}(wR)) / ${o}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${o}(uniforms.Dy_shape[${s}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }
              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${o}(dyCCorner) + ${o}(wC)) / ${o}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${o}(uniforms.Dy_shape[${c}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${d?`
                var x_offset = ${g.indicesToOffset(`${g.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${u};
                var w_offset = ${f.indicesToOffset(`${f.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${h};
                  `:``}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${d?4:u}) {
                  ${(()=>{let e=``;if(d)u===4?e+=`
        let xValue = ${g.getByOffset(`x_offset`)};
        let wValue = ${f.getByOffset(`w_offset`)};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:u===2?e+=`
          dotProd = dotProd + dot(vec4<${o}>(${g.getByOffset(`x_offset`)}, ${g.getByOffset(`x_offset + 1u`)}), vec4<${o}>(${f.getByOffset(`w_offset`)}, ${f.getByOffset(`w_offset + 1u`)}));
          x_offset += 2u;
          w_offset += 2u;`:u===1&&(e+=`
          dotProd = dotProd + dot(vec4<${o}>(${g.getByOffset(`x_offset`)}, ${g.getByOffset(`x_offset + 1u`)}, ${g.getByOffset(`x_offset + 2u`)}, ${g.getByOffset(`x_offset + 3u`)}), vec4<${o}>(${f.getByOffset(`w_offset`)}, ${f.getByOffset(`w_offset + 1u`)}, ${f.getByOffset(`w_offset + 2u`)}, ${f.getByOffset(`w_offset + 3u`)}));
          x_offset += 4u;
          w_offset += 4u;`);else if(e+=`
                  let xValue = ${a?g.getByOffset(`${g.indicesToOffset(`${g.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${u}`):g.get(`batch`,`inputChannel`,`idyR`,`idyC`)};
        `,u===1)e+=`
          let w_offset = ${f.indicesToOffset(`${f.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${f.getByOffset(`w_offset / ${h}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let t=0;t<u;t++)e+=`
            let wValue${t} = ${f.getByOffset(`${f.indicesToOffset(`${f.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${t}, wOutChannel)`)} / ${h}`)};
            dotProd = dotProd + xValue[${t}] * wValue${t};`;return e})()}
                  inputChannel = inputChannel + ${d?4:u};
                }
                ${(()=>{if(p===0)return``;if(!d)throw Error(`packInputAs4 ${d} is not true.`);let e=``;if(u===1){e+=`dotProd = dotProd`;for(let t=0;t<p;t++)e+=`
            + ${g.getByOffset(`x_offset + ${t}`)} * ${f.getByOffset(`w_offset + ${t}`)}`;e+=`;`}else if(u===2){if(p!==2)throw Error(`Invalid inputChannelsRemainder ${p}.`);e+=`
          let xValue = ${g.getByOffset(`x_offset`)};
          let wValue = ${f.getByOffset(`w_offset`)};
          dotProd = dotProd + dot(xValue, wValue);`}return e})()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${r?` + bias[d1 / ${m}]`:``};
            ${v.setByOffset(`global_idx`,`value`)};
          `;return`
    ${t.registerUniforms(n).declareVariables(..._,v)}
      ${t.mainStart()}
      ${t.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)};
    ${x}}`}}}}),bo,xo,So,Co,wo,To,Eo,Do,Oo,ko=d(()=>{yo(),Oa(),Kn(),bo=(e,t,n,r,i,a)=>(e-1)*t+n+(r-1)*i+1-a,xo=(e,t,n,r,i)=>{let a=Math.floor(e/2);t===`SAME_UPPER`?(n[r]=a,n[i]=e-a):t===`SAME_LOWER`&&(n[r]=e-a,n[i]=a)},So=(e,t,n,r,i,a,o,s,c,l)=>{let u=e.length-2,d=l.length===0;c.length<u&&c.push(...Array(u-c.length).fill(0));let f=e[0],p=t[s?3:1]*i;for(let i=0,f=e.length-u-+!!s;i<u;++i,++f){let s=e[f],p=d?s*o[i]:l[i],m=bo(s,o[i],a[i],t[f],n[i],p);xo(m,r,a,i,i+u),d&&l.push(o[i]*(s-1)+c[i]+(t[f]-1)*n[i]+1-a[i]-a[i+u])}l.splice(0,0,f),l.splice(s?3:1,0,p)},Co=(e,t)=>{let n=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((e,t)=>e*t,1)===0){n.length=0;for(let e=2;e<t[1].dims.length;++e)n.push(t[1].dims[e])}let r=e.format===`NHWC`;n.splice(0,0,t[1].dims[0]),n.splice(r?3:1,0,t[1].dims[1]);let i=e.pads.slice(),a=e.outputShape.slice(),o=e.outputPadding.slice(),s=t[0].dims,c=e.dilations.slice();if(c.reduce((e,t)=>e+t,0)===0){let e=t[0].dims.length-2;c=Array(e).fill(1)}let l=e.strides.slice();if(l.reduce((e,t)=>e+t,0)===0){let e=t[0].dims.length-2;l=Array(e).fill(1)}So(s,n,c,e.autoPad,e.group,i,l,r,o,a);let u=Object.assign({},e);return Object.assign(u,{kernelShape:n,pads:i,outputPadding:o,outputShape:a,dilations:c,strides:l}),u},wo=e=>{let t=Da(e),n=e.format,r=[`NOTSET`,`VALID`,`SAME_UPPER`,`SAME_LOWER`][typeof e.autoPad>`u`?0:e.autoPad],i=e.dilations,a=e.group??1,o=e.kernelShape,s=e.pads,c=e.strides,l=e.wIsConst();return{autoPad:r,format:n,dilations:i,group:a,kernelShape:o,outputPadding:e.outputPadding,outputShape:e.outputShape,pads:s,strides:c,wIsConst:l,...t,cacheKey:`${e.format};${t.activation};`}},To=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw Error(`Conv requires 2 or 3 inputs`);if(e[0].dims.length!==4&&e[0].dims.length!==3)throw Error(`currently only support 2-dimensional conv`);if(e[0].dims.length!==e[1].dims.length)throw Error(`filter does not have same dimension as input`);if(e[0].dims[t.format===`NHWC`?e[0].dims.length-1:1]!==e[1].dims[0])throw Error(`FILTER_IN_CHANNEL should be equal to DATA_CHANNEL`);let n=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==n))throw Error(`invalid bias`);let r=e[0].dims.length-2;if(t.dilations.reduce((e,t)=>e+t,0)>0&&t.dilations.length!==r)throw Error(`dilations should be ${r}D`);if(t.strides.reduce((e,t)=>e+t,0)>0&&t.strides.length!==r)throw Error(`strides should be ${r}D`);if(t.pads.reduce((e,t)=>e+t,0)>0&&t.pads.length!==r*2)throw Error(`pads should be ${r*2}D`);if(t.outputPadding.length!==r&&t.outputPadding.length!==0)throw Error(`output_padding should be ${r}D`);if(t.kernelShape.reduce((e,t)=>e+t,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw Error(`invalid kernel shape`);if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw Error(`invalid output shape`)},Eo=(e,t,n,r)=>{let i=e.kernelCustomData.wT??e.compute(Un(t[1],[2,3,0,1]),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];n.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=i);let a=[t[0],i];t.length===3&&a.push(t[2]),e.compute(vo(a,n,r),{inputs:a})},Do=(e,t)=>{let n=t.format===`NHWC`,r=[e.inputs[0].reshape(n?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&r.push(e.inputs[2]);let i=t.kernelShape;(i.length===0||i[0]===0)&&(i=[e.inputs[1].dims[2]]);let a=t.dilations;(a.length===0||a[0]===0)&&(a=[1]);let o=t.strides;(o.length===0||o[0]===0)&&(o=[1]);let s=t.pads;s.length===0&&(s=[0,0]),s=[0,s[0],0,s[1]],o=[1].concat(o),a=[1].concat(a),i=[1].concat(i);let c=t.outputPadding;c=[0].concat(c);let l=Co({...t,pads:s,strides:o,dilations:a,kernelShape:i,outputPadding:c},r);Eo(e,r,l,e=>n?[e[0],e[2],e[3]]:[e[0],e[1],e[3]])},Oo=(e,t)=>{if(To(e.inputs,t),e.inputs[0].dims.length===3)Do(e,t);else{let n=Co(t,e.inputs);Eo(e,e.inputs,n)}}}),Ao,jo,Mo,No=d(()=>{L(),B(),H(),Y(),Ao=(e,t,n,r)=>{let i=z.size(t),a=t.length,o=q(`input`,e,a),s=J(`output`,e,a),c=n.dataType===6?n.getInt32Array()[0]:Number(n.getBigInt64Array()[0]),l=z.normalizeAxis(c,a);return{name:`CumSum`,shaderCache:{hint:r.cacheKey,inputDependencies:[`rank`]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:[{type:12,data:i},{type:12,data:l},...W(t,t)]}),getShaderSource:e=>{let t=` i32(${o.indicesGet(`inputIndices`,`uniforms.axis`)}) `,n=K(`uniforms.input_shape`,`uniforms.axis`,a),i=r.reverse?t+(r.exclusive?` + 1`:``):`0`,c=r.reverse?n:t+(r.exclusive?``:` + 1`);return`
                ${e.registerUniform(`outputSize`,`u32`).registerUniform(`axis`,`u32`).declareVariables(o,s)}
                ${e.mainStart()}
                  ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}
                  var inputIndices = ${s.offsetToIndices(`global_idx`)};
                  var sum = ${s.type.value}(0);
                  let first : i32 = ${i};
                  let last : i32 = ${c};
                  for (var i : i32 = first; i < last; i++) {
                    ${o.indicesSet(`inputIndices`,`uniforms.axis`,`u32(i)`)};
                    sum = sum + ${o.getByIndices(`inputIndices`)};
                  }
                  ${s.setByOffset(`global_idx`,`sum`)};
                }`}}},jo=(e,t)=>{let n=e.inputs[0].dims,r=e.inputs[0].dataType,i=e.inputs[1];e.compute(Ao(r,n,i,t),{inputs:[0]})},Mo=e=>{let t=e.exclusive===1,n=e.reverse===1;return V({exclusive:t,reverse:n})}}),Po,Fo,Io,Lo,Ro,zo=d(()=>{L(),B(),H(),Y(),Po=e=>{if(!e||e.length!==1)throw Error(`DepthToSpace requires 1 input.`);if(e[0].dims.length!==4)throw Error(`DepthToSpace requires 4D input.`)},Fo=(e,t,n,r)=>{let i=[];i.push(`fn perm(i: ${r.type.indices}) -> ${n.type.indices} {
    var a: ${n.type.indices};`);for(let r=0;r<t;++r)i.push(n.indicesSet(`a`,e[r],`i[${r}]`));return i.push(`return a;}`),i.join(`
`)},Io=(e,t)=>{let n,r,i,a,o,s,c=t.format===`NHWC`,l=t.blocksize,u=t.mode===`DCR`;c?([n,r,i,a]=e.dims,o=u?[n,r,i,l,l,a/l**2]:[n,r,i,a/l**2,l,l],s=u?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([n,r,i,a]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],o=u?[n,l,l,a/l**2,r,i]:[n,a/l**2,l,l,r,i],s=u?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let d=e.reshape(o),f=d.dims.length,p=e.dataType,m=q(`a`,p,f),h=J(`output`,p,f);return{name:`DepthToSpace`,shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:[`rank`]},getRunData:e=>{let t=c?[n,r*l,i*l,a/l**2]:[n,a/l**2,r*l,i*l],o=z.size(t),u=d.dims,f=z.sortBasedOnPerm(u,s);return{outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:[{type:12,data:o},...W(u,f)]}},getShaderSource:e=>`
  ${e.registerUniform(`output_size`,`u32`).declareVariables(m,h)}

  ${Fo(s,f,m,h)}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}

    let indices = ${h.offsetToIndices(`global_idx`)};
    let aIndices = perm(indices);

    ${h.setByOffset(`global_idx`,m.getByIndices(`aIndices`))}
  }`}},Lo=(e,t)=>{Po(e.inputs),e.compute(Io(e.inputs[0],t))},Ro=e=>V({blocksize:e.blocksize,mode:e.mode,format:e.format})}),Bo,Vo,Ho,Uo,Wo,Go,Ko,qo,Jo,Yo,Xo,Zo=d(()=>{L(),B(),H(),Y(),Bo=`[a-zA-Z]|\\.\\.\\.`,Vo=`(`+Bo+`)+`,Ho=`^`+Vo+`$`,Uo=`(`+Vo+`,)*`+Vo,Wo=`^`+Uo+`$`,Go=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let n=this.symbolToIndices.get(e);n===void 0?n=[t]:n.push(t),this.symbolToIndices.set(e,n)}},Ko=class{constructor(e,t){this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=[],this.outputDims=[];let[n,r]=t.includes(`->`)?t.split(`->`,2):[t,``];if(!n.match(RegExp(Wo)))throw Error(`Invalid LHS term`);if(n.split(`,`).forEach((t,n)=>{let r=e[n].dims.slice();if(!t.match(RegExp(Ho)))throw Error(`Invalid LHS term`);let i=this.processTerm(t,!0,r,n);this.lhs.push(i)}),r===``)r+=[...this.symbolToInfo.entries()].filter(([e,t])=>t.count===1||e===`...`).map(([e])=>e).join(``);else if(!r.match(RegExp(Vo)))throw Error(`Invalid RHS`);r.match(RegExp(Bo,`g`))?.forEach(e=>{if(e===`...`)this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let t=this.symbolToInfo.get(e);if(t===void 0)throw Error(`Invalid RHS symbol`);this.outputDims.push(t.dimValue)}}),this.rhs=this.processTerm(r,!1,this.outputDims)}addSymbol(e,t,n){let r=this.symbolToInfo.get(e);if(r!==void 0){if(r.dimValue!==t&&r.count!==1)throw Error(`Dimension mismatch`);r.count++,r.inputIndices.push(n)}else r={count:1,dimValue:t,inputIndices:[n]};this.symbolToInfo.set(e,r)}processTerm(e,t,n,r=-1){let i=n.length,a=!1,o=[],s=0;if(!e.match(RegExp(Ho))&&!t&&e!==``)throw Error(`Invalid LHS term`);let c=e.match(RegExp(Bo,`g`)),l=new Go(r);return c?.forEach((e,u)=>{if(e===`...`){if(a)throw Error(`Only one ellipsis is allowed per input term`);a=!0;let e=i-c.length+1;if(e<0)throw Error(`Ellipsis out of bounds`);if(o=n.slice(s,s+e),this.hasEllipsis){if(this.ellipsisDims.length!==o.length||this.ellipsisDims.toString()!==o.toString())throw Error(`Ellipsis dimensions mismatch`)}else if(t)this.hasEllipsis=!0,this.ellipsisDims=o;else throw Error(`Ellipsis must be specified in the LHS`);for(let e=0;e<o.length;e++){let t=String.fromCharCode(48+e);l.addSymbol(t,u+e),this.addSymbol(t,n[s++],r)}}else l.addSymbol(e,u+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(e,n[s++],r)}),l}},qo=e=>e+`_max`,Jo=(e,t,n,r)=>{let i=e.map(e=>e.length).map((e,n)=>q(`input${n}`,t,e)),a=z.size(r),o=J(`output`,t,r.length),s=[...n.symbolToInfo.keys()].filter(e=>!n.rhs.symbolToIndices.has(e));return{name:`Einsum`,shaderCache:{hint:n.equation,inputDependencies:e.map(()=>`rank`)},getRunData:()=>{let i=s.filter(e=>n.symbolToInfo.has(e)).map(e=>({type:12,data:n.symbolToInfo.get(e)?.dimValue||0}));i.push({type:12,data:a});let o=e.map((e,t)=>[...W(e)]).reduce((e,t)=>e.concat(t),i);return o.push(...W(r)),{outputs:[{dims:r,dataType:t}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:o}},getShaderSource:e=>{let t=[],r=[],a=[],c=[],l=[],u=n.symbolToInfo.size===n.rhs.symbolToIndices.size;n.symbolToInfo.forEach((e,s)=>{if(n.rhs.symbolToIndices.has(s)){let r=n.rhs.symbolToIndices.get(s)?.[0];r!==void 0&&n.lhs.forEach((n,a)=>{if(e.inputIndices.includes(a)){let e=n.symbolToIndices.get(s);if(e===void 0)throw Error(`Invalid symbol error`);e.forEach(e=>{t.push(`${i[a].indicesSet(`input${a}Indices`,e,o.indicesGet(`outputIndices`,r))}`)})}})}else n.lhs.forEach((t,n)=>{if(e.inputIndices.includes(n)){let e=t.symbolToIndices.get(s);if(e===void 0)throw Error(`Invalid symbol error`);e.forEach(e=>{r.push(`${i[n].indicesSet(`input${n}Indices`,e,`${s}`)}`)}),l.push(`prod *= ${i[n].getByIndices(`input${n}Indices`)};`)}}),a.push(`for(var ${s}: u32 = 0; ${s} < uniforms.${qo(s)}; ${s}++) {`),c.push(`}`)});let d=u?[...t,`let sum = ${i.map((e,t)=>e.getByIndices(`input${t}Indices`)).join(` * `)};`]:[...t,`var sum = 0.0;`,...a,...r,`var prod = 1.0;`,...l,`sum += prod;`,...c];return`
            ${e.registerUniforms(s.map(e=>({name:`${qo(e)}`,type:`u32`}))).registerUniform(`outputSize`,`u32`).declareVariables(...i,o)}

            ${e.mainStart()}
            ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}
            var outputIndices = ${o.offsetToIndices(`global_idx`)};
            ${i.map((e,t)=>`var input${t}Indices: ${i[t].type.indices};`).join(`
`)}
            ${d.join(`
`)};
            ${o.setByOffset(`global_idx`,`sum`)};
          }`}}},Yo=(e,t)=>{let n=new Ko(e.inputs,t.equation),r=n.outputDims,i=e.inputs.map((e,t)=>e.dims);e.compute(Jo(i,e.inputs[0].dataType,n,r))},Xo=e=>{let t=e.equation.replace(/\s+/g,``);return V({equation:t})}}),Qo,$o,es,ts,ns,rs=d(()=>{L(),B(),Y(),Qo=e=>{if(!e||e.length!==2)throw Error(`Expand requires 2 input.`);let t=e[0].dims,n=Array.from(e[1].getBigInt64Array(),Number),r=n.length<t.length?0:n.length-t.length,i=t.length<n.length?0:t.length-n.length;for(;r<n.length&&i<t.length;++r,++i)if(n[r]!==t[i]&&n[r]!==1&&t[i]!==1)throw Error(`Expand requires shape to be broadcastable to input`)},$o=(e,t)=>{let n=e.length-t.length,r=[];for(let t=0;t<n;++t)r.push(e[t]);for(let i=0;i<t.length;++i)r.push(t[i]===1?e[i+n]:t[i]);return r},es=(e,t)=>e.length>t.length?$o(e,t):$o(t,e),ts=e=>{let t=e[0].dims,n=Array.from(e[1].getBigInt64Array(),Number),r=es(t,n),i=e[0].dataType,a=i===9||z.size(t)===1,o=i===9||t.length>0&&t[t.length-1]%4==0?4:1,s=a||r.length>0&&r[r.length-1]%4==0?4:1,c=Math.ceil(z.size(r)/s),l=e=>{let n=q(`input`,i,t.length,o),a=J(`output`,i,r.length,s),c;if(i===9){let e=(e,t,r=``)=>`
          let outputIndices${t} = ${a.offsetToIndices(`outputOffset + ${t}u`)};
          let offset${t} = ${n.broadcastedIndicesToOffset(`outputIndices${t}`,a)};
          let index${t} = offset${t} / 4u;
          let component${t} = offset${t} % 4u;
          ${e}[${t}] = ${r}(${n.getByOffset(`index${t}`)}[component${t}]);
        `;c=`
        let outputOffset = global_idx * ${s};
        var data = vec4<u32>(0);
        ${e(`data`,0,`u32`)}
        ${e(`data`,1,`u32`)}
        ${e(`data`,2,`u32`)}
        ${e(`data`,3,`u32`)}
        ${a.setByOffset(`global_idx`,`data`)}
      }`}else c=`
        let outputIndices = ${a.offsetToIndices(`global_idx * ${s}`)};
        let inputOffset = ${n.broadcastedIndicesToOffset(`outputIndices`,a)};
        let data = ${a.type.value}(${n.getByOffset(`inputOffset / ${o}`)});
        ${a.setByOffset(`global_idx`,`data`)}
      }`;return`
    ${e.registerUniform(`vec_size`,`u32`).declareVariables(n,a)}
    ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.vec_size`)}
    ${c}`},u=[{type:12,data:c},...W(t,r)];return{name:`Expand`,shaderCache:{hint:`${r.length};${o}${s}`,inputDependencies:[`rank`]},getShaderSource:l,getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:u})}},ns=e=>{Qo(e.inputs),e.compute(ts(e.inputs),{inputs:[0]})}}),is,as,os=d(()=>{L(),B(),Y(),Qi(),is=e=>{let t=e[0].dataType,n=z.size(e[0].dims),r=z.size(e[1].dims),i=r%4==0;return{name:`FastGeluWithBias`,shaderCache:{hint:`${i}`,inputDependencies:[`type`,`type`]},getShaderSource:e=>{let n=q(`x`,t,[1],4),r=q(`bias`,t,[1],4),a=J(`y`,t,[1],4),o=[{name:`output_vec_size`,type:`u32`},{name:`bias_size`,type:`u32`}],s=e=>`
      let bias${e}_offset: u32 = (global_idx * 4 + ${e}) % uniforms.bias_size;
      let bias${e} = ${r.getByOffset(`bias${e}_offset / 4`)}[bias${e}_offset % 4];`,c=i?`
      let bias = ${r.getByOffset(`global_idx % (uniforms.bias_size / 4)`)};`:`${s(0)}${s(1)}${s(2)}${s(3)}
      let bias = ${n.type.value}(bias0, bias1, bias2, bias3);`;return`${e.registerUniforms(o).declareVariables(n,r,a)}

    ${Wi(On(t))}

    ${e.mainStart(En)}
      ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_vec_size`)}

      let x = ${n.getByOffset(`global_idx`)};
      ${c}
      let x_in = x + bias;
      ${a.setByOffset(`global_idx`,Gi(`x_in`))}
    }`},getRunData:e=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],programUniforms:[{type:12,data:Math.ceil(n/4)},{type:12,data:r}],dispatchGroup:{x:Math.ceil(n/En/4)}})}},as=e=>{e.inputs.length<2||z.size(e.inputs[1].dims)===0?Ki(e):e.compute(is(e.inputs))}}),ss,cs,ls,us,ds=d(()=>{L(),B(),H(),Y(),ss=e=>{if(!e||e.length!==2)throw Error(`Gather requires 2 inputs.`)},cs=(e,t)=>{let n=e[0].dims,r=e[1].dims,i=n.length,a=z.normalizeAxis(t.axis,i),o=n.slice(0);o.splice(a,1,...r);let s=n[a],c=e[0].dataType===9?4:1,l=Math.ceil(z.size(o)/c),u=[{type:12,data:l},{type:6,data:s},{type:12,data:a},...W(e[0].dims,e[1].dims,o)];return{name:`Gather`,shaderCache:{hint:t.cacheKey,inputDependencies:[`rank`,`rank`]},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:u}),getShaderSource:t=>{let n=q(`data`,e[0].dataType,e[0].dims.length,c),s=q(`inputIndices`,e[1].dataType,e[1].dims.length),l=J(`output`,e[0].dataType,o.length,c),u=e=>{let t=r.length,c=`var indicesIndices${e}  = ${s.type.indices}(0);`;for(let n=0;n<t;n++)c+=`${t>1?`indicesIndices${e}[${n}]`:`indicesIndices${e}`} = ${o.length>1?`outputIndices${e}[uniforms.axis + ${n}]`:`outputIndices${e}`};`;c+=`
          var idx${e} = ${s.getByIndices(`indicesIndices${e}`)};
          if (idx${e} < 0) {
            idx${e} = idx${e} + uniforms.axisDimLimit;
          }
          var dataIndices${e} : ${n.type.indices};
        `;for(let n=0,r=0;n<i;n++)n===a?(c+=`${i>1?`dataIndices${e}[${n}]`:`dataIndices${e}`} = u32(idx${e});`,r+=t):(c+=`${i>1?`dataIndices${e}[${n}]`:`dataIndices${e}`} = ${o.length>1?`outputIndices${e}[${r}]`:`outputIndices${e}`};`,r++);return c},d;if(e[0].dataType===9){let e=(e,t,r=``)=>`
          let outputIndices${t} = ${l.offsetToIndices(`outputOffset + ${t}u`)};
          ${u(t)};
          let offset${t} = ${n.indicesToOffset(`dataIndices${t}`)};
          let index${t} = offset${t} / 4u;
          let component${t} = offset${t} % 4u;
          ${e}[${t}] = ${r}(${n.getByOffset(`index${t}`)}[component${t}]);
        `;d=`
        let outputOffset = global_idx * ${c};
        var value = vec4<u32>(0);
        ${e(`value`,0,`u32`)}
        ${e(`value`,1,`u32`)}
        ${e(`value`,2,`u32`)}
        ${e(`value`,3,`u32`)}
        ${l.setByOffset(`global_idx`,`value`)}
      `}else d=`
      let outputIndices = ${l.offsetToIndices(`global_idx`)};
      ${u(``)};
      let value = ${n.getByIndices(`dataIndices`)};
      ${l.setByOffset(`global_idx`,`value`)};
      `;return`
      ${t.registerUniform(`outputSize`,`u32`).registerUniform(`axisDimLimit`,`i32`).registerUniform(`axis`,`u32`).declareVariables(n,s,l)}
      ${t.mainStart()}
        ${t.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}
        ${d}
      }`}}},ls=e=>V({axis:e.axis}),us=(e,t)=>{let n=e.inputs;ss(n),e.compute(cs(e.inputs,t))}}),fs,ps,ms,hs=d(()=>{L(),B(),Y(),fs=(e,t,n,r,i,a,o,s,c)=>{let l=[{type:12,data:a},{type:12,data:r},{type:12,data:i},{type:12,data:n},{type:12,data:o},{type:12,data:s},{type:12,data:c}],u=[a];return l.push(...W(t.dims,u)),e.compute({name:`computeSliceOffsets`,shaderCache:{hint:`${i.length}_${n.length}`,inputDependencies:[`rank`]},getRunData:()=>({outputs:[{dims:u,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:l}),getShaderSource:e=>{let r=[q(`indices_data`,t.dataType,t.dims.length),J(`input_slice_offsets_data`,12,1,1)],a=[{name:`output_size`,type:`u32`},{name:`batch_dims`,type:`u32`},{name:`input_dims`,type:`u32`,length:i.length},{name:`sizes_from_slice_dims_data`,type:`u32`,length:n.length},{name:`num_slices_per_batch`,type:`u32`},{name:`input_batch_stride`,type:`u32`},{name:`num_slice_dims`,type:`u32`}];return`
  ${e.registerUniforms(a).declareVariables(...r)}
  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${i.length===1?`index += i32(uniforms.input_dims);`:`index += i32(uniforms.input_dims[input_dim_idx]);`}
      }
      ${n.length===1?`relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);`:`relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);`}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`}},{inputs:[t],outputs:[-1]})[0]},ps=(e,t)=>{let n=e.inputs,r=n[0].dims,i=n[0].dataType,a=n[1].dims,o=a[a.length-1],s=z.sizeToDimension(a,a.length-1),c=z.sizeFromDimension(r,t.batchDims+o),l=z.sizeToDimension(r,t.batchDims),u=z.sizeFromDimension(r,t.batchDims),d=s/l,f=Array(o),p=c;for(let e=0;e<o;++e)f[o-1-e]=p,p*=r[t.batchDims+o-1-e];let m=fs(e,n[1],f,t.batchDims,r,s,d,u,o),h=t.batchDims+o;if(h>r.length)throw Error(`last dimension of indices must not be larger than rank of input tensor`);let g=a.slice(0,-1).concat(r.slice(h)),_=z.size(g),v=[{type:12,data:_},{type:12,data:c},...W(n[0].dims,m.dims,g)];e.compute({name:`GatherND`,shaderCache:{hint:t.cacheKey,inputDependencies:[`rank`,`rank`]},getRunData:()=>({outputs:[{dims:g,dataType:i}],dispatchGroup:{x:Math.ceil(_/64)},programUniforms:v}),getShaderSource:e=>{let t=q(`data`,n[0].dataType,n[0].dims.length),r=q(`slice_offsets`,12,m.dims.length),i=J(`output`,n[0].dataType,g.length);return`
          ${e.registerUniform(`output_size`,`u32`).registerUniform(`slice_size`,`u32`).declareVariables(t,r,i)}
            ${e.mainStart()}
            ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`}},{inputs:[n[0],m]})},ms=e=>({batchDims:e.batch_dims,cacheKey:``})}),gs,_s,vs,ys,bs=d(()=>{L(),B(),H(),Y(),gs=(e,t)=>{if(e.length<3||e.length>4)throw Error(`GatherBlockQuantized requires 3 or 4 inputs.`);let n=z.normalizeAxis(t.quantizeAxis,e[0].dims.length),r=t.blockSize,i=e[0],a=e[2],o=e.length===4?e[3]:void 0;if(a.dims.length!==i.dims.length||!i.dims.map((e,t)=>t===n?Math.ceil(e/r)===a.dims[t]:e===a.dims[t]).reduce((e,t)=>e&&t,!0))throw Error(`Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.`);if(o){if(o.dataType!==i.dataType)throw Error(`Zero point must have the same data type as the input tensor.`);if(o.dims.length!==a.dims.length||!o.dims.map((e,t)=>e===a.dims[t]).reduce((e,t)=>e&&t,!0))throw Error(`Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.`)}},_s=(e,t)=>{let n=e[0].dims,r=e[1].dims,i=n.length,a=z.normalizeAxis(t.gatherAxis,i),o=z.normalizeAxis(t.quantizeAxis,i),s=n.slice(0);s.splice(a,1,...r);let c=z.size(s),l=e[2].dataType,u=e[0].dataType===22,d=[{type:12,data:c},{type:12,data:o},{type:12,data:a},{type:12,data:t.blockSize},...W(...e.map((e,t)=>e.dims),s)];return{name:`GatherBlockQuantized`,shaderCache:{hint:`${t.cacheKey};${e.filter((e,t)=>t!==1).map(e=>e.dims.join(`_`)).join(`;`)}`,inputDependencies:Array.from({length:e.length},(e,t)=>`rank`)},getRunData:()=>({outputs:[{dims:s,dataType:l}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:d}),getShaderSource:t=>{let i=q(`data`,e[0].dataType,e[0].dims.length),o=q(`inputIndices`,e[1].dataType,e[1].dims.length),c=q(`scales`,e[2].dataType,e[2].dims.length),d=e.length>3?q(`zeroPoint`,e[3].dataType,e[3].dims.length):void 0,f=J(`output`,l,s.length),p=[i,o,c];return d&&p.push(d),`
        ${t.registerUniforms([{name:`output_size`,type:`u32`},{name:`quantize_axis`,type:`u32`},{name:`gather_axis`,type:`u32`},{name:`block_size`,type:`u32`}]).declareVariables(...p,f)}
        ${t.mainStart()}
        let output_indices = ${f.offsetToIndices(`global_idx`)};
        var indices_indices = ${o.type.indices}(0);
        ${r.length>1?`
          for (var i: u32 = 0; i < ${r.length}; i++) {
            let index = ${f.indicesGet(`output_indices`,`uniforms.gather_axis + i`)};
            ${o.indicesSet(`indices_indices`,`i`,`index`)};
          }`:`indices_indices = ${f.indicesGet(`output_indices`,`uniforms.gather_axis`)};`};
        var data_indices = ${i.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${f.indicesGet(`output_indices`,`i`)};
          ${i.indicesSet(`data_indices`,`i`,`index`)};
        }
        var index_from_indices = ${o.getByIndices(`indices_indices`)};
        if (index_from_indices < 0) {
          index_from_indices += ${n[a]};
        }
        ${i.indicesSet(`data_indices`,`uniforms.gather_axis`,`u32(index_from_indices)`)};
        for (var i = uniforms.gather_axis + 1; i < ${s.length}; i++) {
          let index = ${f.indicesGet(`output_indices`,`i + ${r.length} - 1`)};
          ${i.indicesSet(`data_indices`,`i`,`index`)};
        }
        let data_offset = ${i.indicesToOffset(`data_indices`)};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${i.getByOffset(`data_offset / 8`)};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${u?`unpack4xI8`:`unpack4xU8`}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${c.indicesGet(`data_indices`,`uniforms.quantize_axis`)} / uniforms.block_size;
        ${c.indicesSet(`scale_indices`,`uniforms.quantize_axis`,`quantize_axis_index`)};
        var scale = ${c.getByIndices(`scale_indices`)};
        ${d?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${d.indicesToOffset(`zero_point_indices`)};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${d.getByOffset(`zero_point_offset / 8`)};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${u?`unpack4xI8`:`unpack4xU8`}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:`var zero_point = 0`};
        let dequantized_data = ${On(l)}(quantized_data - zero_point) * scale;
        ${f.setByOffset(`global_idx`,`dequantized_data`)};
    }`}}},vs=(e,t)=>{let n=e.inputs;gs(n,t),e.compute(_s(e.inputs,t))},ys=e=>V({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),xs,Ss,Cs,ws,Ts=d(()=>{L(),B(),H(),Y(),xs=e=>{if(!e||e.length!==2)throw Error(`GatherElements requires 2 inputs.`);if(e[0].dims.length<1)throw Error(`GatherElements requires that the data input be rank >= 1.`);if(e[0].dims.length!==e[1].dims.length)throw Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},Ss=(e,t)=>{let n=e[0].dims,r=e[0].dataType,i=n.length,a=e[1].dims,o=e[1].dataType,s=z.normalizeAxis(t.axis,i),c=n[s],l=a.slice(0),u=z.size(l),d=q(`input`,r,i),f=q(`indicesInput`,o,a.length),p=J(`output`,r,l.length),m=[{type:12,data:u},{type:6,data:c},{type:12,data:s}];return m.push(...W(n,a,l)),{name:`GatherElements`,shaderCache:{inputDependencies:[`rank`,`rank`]},getRunData:()=>({outputs:[{dims:l,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:m}),getShaderSource:e=>`
      ${e.registerUniform(`outputSize`,`u32`).registerUniform(`axisDimLimit`,`i32`).registerUniform(`axis`,`u32`).declareVariables(d,f,p)}
      ${e.mainStart()}
      ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}

      let outputIndices = ${p.offsetToIndices(`global_idx`)};

      var idx = ${f.getByOffset(`global_idx`)};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${d.type.indices}(outputIndices);
      ${d.indicesSet(`inputIndices`,`uniforms.axis`,`u32(idx)`)};
      let value = ${d.getByIndices(`inputIndices`)};

      ${p.setByOffset(`global_idx`,`value`)};
  }`}},Cs=e=>V({axis:e.axis}),ws=(e,t)=>{let n=e.inputs;xs(n),e.compute(Ss(e.inputs,t))}}),Es,Ds,Os,ks,As=d(()=>{L(),B(),Y(),Es=e=>{if(!e)throw Error(`Input is missing`);if(e.length<2||e.length>3)throw Error(`Invaid input number.`);if(e.length===3&&e[2].dims.length>2)throw Error(`Invalid input shape of C`);if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw Error(`Input types are mismatched`)},Ds=(e,t)=>{let n=e[0].dims.slice(),r=e[1].dims.slice(),[i,a,o]=Kt.getShapeOfGemmResult(n,t.transA,r,t.transB,e.length===3?e[2].dims:void 0),s=[i,a];if(!s)throw Error(`Can't use gemm on the given tensors`);let c=Math.ceil(a/16),l=Math.ceil(i/16);z.size(s);let u=[{type:12,data:c},{type:12,data:i},{type:12,data:a},{type:12,data:o},{type:1,data:t.alpha},{type:1,data:t.beta}],d=[`type`,`type`];return e.length===3&&(u.push(...W(e[2].dims)),d.push(`rank`)),u.push(...W(s)),{name:`GemmShared`,shaderCache:{hint:`${t.cacheKey}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:s,dataType:e[0].dataType}],dispatchGroup:{x:c*l},programUniforms:u}),getShaderSource:n=>{let r=q(`a`,e[0].dataType,e[0].dims),i=q(`b`,e[1].dataType,e[1].dims),a=null,o=[r,i];e.length===3&&(a=q(`c`,e[2].dataType,e[2].dims.length),o.push(a));let c=J(`output`,e[0].dataType,s.length);o.push(c);let l=[{name:`num_tile_n`,type:`u32`},{name:`M`,type:`u32`},{name:`N`,type:`u32`},{name:`K`,type:`u32`},{name:`alpha`,type:`f32`},{name:`beta`,type:`f32`}],u=``,d=``;t.transA&&t.transB?(d=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${r.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${i.type.value}(0);
      }
      `,u=`value += tile_a[k][local_id.y] * tile_b[local_id.x][k];`):t.transA&&!t.transB?(d=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${r.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${i.type.value}(0);
      }
      `,u=`value += tile_a[k][local_id.y] * tile_b[k][local_id.x];`):!t.transA&&t.transB?(d=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${r.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${i.type.value}(0);
      }
      `,u=`value += tile_a[local_id.y][k] * tile_b[local_id.x][k];`):!t.transA&&!t.transB&&(d=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${r.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${i.type.value}(0);
      }
      `,u=`value += tile_a[local_id.y][k] * tile_b[k][local_id.x];`);let f=t.alpha===1?``:`value *= uniforms.alpha;`;return`
  ${n.registerUniforms(l).declareVariables(...o)}
  var<workgroup> tile_a: array<array<${r.type.storage}, 16>, 16>;
  var<workgroup> tile_b: array<array<${i.type.storage}, 16>, 16>;
  ${n.mainStart([16,16,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * 16;
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * 16;
    let num_tiles = (uniforms.K - 1) / 16 + 1;
    var k_start = 0u;
    var value = ${c.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${d}
      k_start = k_start + 16;
      workgroupBarrier();

      for (var k: u32 = 0u; k < 16; k++) {
        ${u}
      }
      workgroupBarrier();
    }

    ${f}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${a==null?``:`let cOffset = ${a.broadcastedIndicesToOffset(`vec2(m, n)`,c)}; value += ${c.type.value}(uniforms.beta) * ${a.getByOffset(`cOffset`)};`}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`}}},Os=e=>({transA:e.transA,transB:e.transB,alpha:e.alpha,beta:e.beta,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}),ks=(e,t)=>{Es(e.inputs),e.compute(Ds(e.inputs,t))}}),js,Ms,Ns,Ps,Fs,Is,Ls,Rs,zs,Bs,Vs,Hs,Us,Ws,Gs=d(()=>{L(),B(),H(),Y(),[js,Ms,Ns,Ps]=[0,1,2,3],Fs=e=>{if(e[0].dims.length!==4)throw Error(`only 4-D tensor is supported.`);if(e[0].dims.length!==e[1].dims.length)throw Error(`input dimensions must be equal to grid dimensions`);if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw Error(`grid batch size must match input batch size`)},Is=`
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`,Ls=e=>`
  fn gs_bicubic_interpolate(p: mat4x4<${e}>, x: f32, y: f32) -> ${e} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${e}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`,Rs=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,zs=e=>`
  ${e.paddingMode===`reflection`?`
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }`:``}
`,Bs=(e,t,n)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${js}] = batch;
     indices[${Ms}] = channel;`+(()=>{switch(n.paddingMode){case`zeros`:return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${Ns}] = u32(r);
            indices[${Ps}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case`border`:return`
          indices[${Ns}] = u32(clamp(r, 0, H - 1));
          indices[${Ps}] = u32(clamp(c, 0, W - 1));
        `;case`reflection`:return`
          indices[${Ns}] = gs_reflect(r, border[1], border[3]);
          indices[${Ps}] = gs_reflect(c, border[0], border[2]);
        `;default:throw Error(`padding mode ${n.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices(`indices`)};
  }
`,Vs=(e,t,n)=>(()=>{switch(n.mode){case`nearest`:return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${js}], indices[${Ms}], border);
        `;case`bilinear`:return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${js}], indices[${Ms}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${js}], indices[${Ms}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${js}], indices[${Ms}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${js}], indices[${Ms}], border);

          let dx2 = ${t}(f32(x2) - x);
          let dx1 = ${t}(x - f32(x1));
          let dy2 = ${t}(f32(y2) - y);
          let dy1 = ${t}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;case`bicubic`:return`
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${t}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${js}], indices[${Ms}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw Error(`mode ${n.mode} is not supported`)}})()+`${e.setByOffset(`global_idx`,`result`)}`,Hs=(e,t)=>{let n=q(`x`,e[0].dataType,e[0].dims.length),r=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],i=q(`grid`,e[1].dataType,r.length,2),a=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format===`NHWC`&&(a=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[js,Ms,Ns,Ps]=[0,3,1,2]);let o=J(`output`,e[0].dataType,a.length),s=n.type.value,c=[{type:12,data:z.size(a)},...W(e[0].dims,r,a)];return{name:`GridSample`,shaderCache:{hint:`${t.cacheKey}`,inputDependencies:[`type`,`type`]},getRunData:e=>{let t=z.size(a);return{outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(t/64)},programUniforms:c}},getShaderSource:e=>`
  ${e.registerUniform(`output_size`,`u32`).declareVariables(n,i,o)}
  ${Is}
  ${Ls(s)}
  ${Rs(t)}
  ${zs(t)}
  ${Bs(n,s,t)}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
      let H_in = i32(uniforms.x_shape[${Ns}]);
      let W_in = i32(uniforms.x_shape[${Ps}]);

      ${t.alignCorners===0?`
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      `:`
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${o.offsetToIndices(`global_idx`)};
      var grid_indices = vec3<u32>(indices[${js}], indices[${Ns}], indices[${Ps}]);
      let nxy = ${i.getByIndices(`grid_indices`)};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${Vs(o,s,t)}
  }`}},Us=(e,t)=>{Fs(e.inputs),e.compute(Hs(e.inputs,t))},Ws=e=>V({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),Ks,qs,Js,Ys,Xs,Zs,Qs,$s=d(()=>{L(),B(),H(),mn(),Qr(),Y(),Kn(),Ks=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,qs=(e,t)=>{let n=e[0],r=Ks(e,1),i=Ks(e,2),a=Ks(e,3),o=Ks(e,4),s=Ks(e,5),c=Ks(e,6),l=Ks(e,7);if(n.dims.length!==3&&n.dims.length!==5)throw Error(`Input query is expected to have 3 or 5 dimensions`);let u=n.dims[0],d=n.dims[1],f=n.dims.length===3?n.dims[2]:t.numHeads*n.dims[4],p=d,m=0,h=0,g=Math.floor(f/t.numHeads);if(c&&l&&z.size(c.dims)&&z.size(l.dims)){if(c.dims.length!==4)throw Error(`Input "past_key" is expected to have 4 dimensions`);if(c.dims[0]!==u||c.dims[1]!==t.numHeads||c.dims[3]!==g)throw Error(`Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)`);if(l.dims[0]!==u||l.dims[1]!==t.numHeads||l.dims[3]!==g)throw Error(`Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)`);if(c.dims[2]!==l.dims[2])throw Error(`Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)`);if(l.dims.length!==4)throw Error(`Input "past_value" is expected to have 4 dimensions`);m=c.dims[2],h=c.dims[2]}else if(c&&z.size(c.dims)||l&&z.size(l.dims))throw Error(`Input "past_key" and "past_value" shall be both present or both absent`);let _;if(r&&z.size(r.dims)>0){if(n.dims.length!==3)throw Error(`Input "query" is expected to have 3 dimensions when key is given`);if(r.dims.length<3||r.dims.length>5)throw Error(`Input "key" is expected to have 3, 4, or 5 dimensions`);if(n.dims[0]!==r.dims[0])throw Error(`Input "query" and "key" shall have same dim 0 (batch size)`);if(r.dims.length===3){if(r.dims[2]!==n.dims[2])throw Error(`Input "query" and "key" shall have same dim 2 (hidden_size)`);_=2,p=r.dims[1]}else if(r.dims.length===5){if(r.dims[2]!==t.numHeads||r.dims[3]!==2||r.dims[4]!==g)throw Error(`Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv`);if(i)throw Error(`Expect "value" be none when "key" has packed kv format.`);_=5,p=r.dims[1]}else{if(r.dims[1]!==t.numHeads||r.dims[3]!==g)throw Error(`Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key`);_=0,p=r.dims[2]}}else{if(n.dims.length!==5)throw Error(`Input "query" is expected to have 5 dimensions when key is empty`);if(n.dims[2]!==t.numHeads||n.dims[3]!==3)throw Error(`Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv`);_=3}if(a&&z.size(a.dims)>0){if(a.dims.length!==1)throw Error(`Input "bias" is expected to have 1 dimension`);if(r&&r.dims.length===5&&r.dims[3]===2)throw Error(`bias is not allowed for packed kv.`)}let v=m+p,y=0;if(o&&z.size(o.dims)>0){y=8;let e=o.dims;throw e.length===1?e[0]===u?y=1:e[0]===3*u+2&&(y=3):e.length===2&&e[0]===u&&e[1]===v&&(y=5),Error(y===8?`Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)`:`Mask not supported`)}let b=!1,x=f;if(i&&z.size(i.dims)>0){if(i.dims.length!==3&&i.dims.length!==4)throw Error(`Input "value" is expected to have 3 or 4 dimensions`);if(n.dims[0]!==i.dims[0])throw Error(`Input "query" and "value" shall have same dim 0 (batch_size)`);if(i.dims.length===3){if(p!==i.dims[1])throw Error(`Input "key" and "value" shall have the same dim 1 (kv_sequence_length)`);x=i.dims[2]}else{if(p!==i.dims[2])throw Error(`Input "key" and "value" shall have the same dim 2 (kv_sequence_length)`);x=i.dims[1]*i.dims[3],b=!0}}if(o&&z.size(o.dims)>0)throw Error(`Key padding mask is not supported`);if(s&&z.size(s.dims)>0){if(s.dims.length!==4)throw Error(`Input "attention_bias" is expected to have 4 dimensions`);if(s.dims[0]!==u||s.dims[1]!==t.numHeads||s.dims[2]!==d||s.dims[3]!==v)throw Error(`Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)`)}return{batchSize:u,sequenceLength:d,pastSequenceLength:m,kvSequenceLength:p,totalSequenceLength:v,maxSequenceLength:h,inputHiddenSize:0,hiddenSize:f,vHiddenSize:x,headSize:g,vHeadSize:Math.floor(x/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:y,scale:t.scale,broadcastResPosBias:!1,passPastInKv:b,qkvFormat:_}},Js=e=>V({...e}),Ys=V({perm:[0,2,1,3]}),Xs=(e,t,n,r,i,a,o)=>{let s=[r,i,a],c=z.size(s),l=[{type:12,data:c},{type:12,data:o},{type:12,data:a}];return e.compute({name:`MultiHeadAttentionAddBias`,shaderCache:{inputDependencies:[`type`,`type`]},getRunData:()=>({outputs:[{dims:s,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:l}),getShaderSource:e=>{let r=J(`qkv_with_bias`,t.dataType,s),i=q(`qkv`,t.dataType,s),a=q(`bias`,n.dataType,s);return`
  ${e.registerUniforms([{name:`output_size`,type:`u32`},{name:`bias_offset`,type:`u32`},{name:`hidden_size`,type:`u32`}]).declareVariables(i,a,r)}
  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`}},{inputs:[t,n],outputs:[-1]})[0]},Zs=(e,t,n,r,i,a,o,s)=>{let c=a;if(o&&z.size(o.dims)>0){if(r===1)throw Error(`AddBiasReshape is not implemented. Please export your model with packed QKV or KV`);return c=Xs(e,a,o,t,r,n*i,s),c=c.reshape([t,r,n,i]),n===1||r===1?c:e.compute(Un(c,Ys.perm),{inputs:[c],outputs:[-1]})[0]}return a.dims.length===3&&(c=a.reshape([t,r,n,i])),n===1||r===1?c:e.compute(Un(c,Ys.perm),{inputs:[c],outputs:[-1]})[0]},Qs=(e,t)=>{let n=qs(e.inputs,t),r=e.inputs[0],i=Ks(e.inputs,1),a=Ks(e.inputs,2),o=Ks(e.inputs,3),s=Ks(e.inputs,4),c=Ks(e.inputs,5),l=Ks(e.inputs,6),u=Ks(e.inputs,7);if(r.dims.length===5)throw Error(`Packed QKV is not implemented`);if(i?.dims.length===5)throw Error(`Packed KV is not implemented`);let d=i&&a&&i.dims.length===4&&a.dims.length===4,f=Zs(e,n.batchSize,n.numHeads,n.sequenceLength,n.headSize,r,o,0);if(d)return Yr(e,f,i,a,s,void 0,l,u,c,n);if(!i||!a)throw Error(`key and value must be provided`);let p=Zs(e,n.batchSize,n.numHeads,n.kvSequenceLength,n.headSize,i,o,n.hiddenSize),m=Zs(e,n.batchSize,n.numHeads,n.kvSequenceLength,n.vHeadSize,a,o,2*n.hiddenSize);Yr(e,f,p,m,s,void 0,l,u,c,n)}}),ec,tc,nc,rc,ic,ac,oc,sc=d(()=>{L(),B(),H(),Y(),ec=e=>{if(!e||e.length<1)throw Error(`too few inputs`)},tc=(e,t)=>{let n=[],r=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(e=>n.push(Number(e))),r=n.length),V({numOutputs:r,axis:t.axis,splitSizes:n})},nc=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${K(`uniforms.size_in_split_axis`,`i`,e)}) {
        return i;
    }
    }
    return ${e}u;
}`,rc=e=>{let t=e.length,n=[];for(let r=0;r<t;++r){let i=e[r].setByIndices(`indices`,`input[global_idx]`);t===1?n.push(i):r===0?n.push(`if (output_number == ${r}u) { ${i} }`):r===t-1?n.push(`else { ${i} }`):n.push(`else if (output_number == ${r}) { ${i} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${n.join(`
`)}
      }`},ic=(e,t)=>{let n=e[0].dims,r=z.size(n),i=e[0].dataType,a=z.normalizeAxis(t.axis,n.length),o=Array(t.numOutputs),s=q(`input`,i,n.length),c=Array(t.numOutputs),l=[],u=[],d=0,f=[{type:12,data:r}];for(let r=0;r<t.numOutputs;r++){d+=t.splitSizes[r],c[r]=d;let s=n.slice();s[a]=t.splitSizes[r],u.push(s),o[r]=J(`output${r}`,i,s.length),l.push({dims:u[r],dataType:e[0].dataType})}return f.push({type:12,data:c},...W(n,...u)),{name:`Split`,shaderCache:{hint:t.cacheKey,inputDependencies:[`rank`]},getShaderSource:e=>`
  ${e.registerUniform(`input_size`,`u32`).registerUniform(`size_in_split_axis`,`u32`,c.length).declareVariables(s,...o)}
  ${nc(c.length)}
  ${rc(o)}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.input_size`)}

    var indices = ${s.offsetToIndices(`global_idx`)};
    var index = ${s.indicesGet(`indices`,a)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${K(`uniforms.size_in_split_axis`,`output_number - 1u`,c.length)};
      ${s.indicesSet(`indices`,a,`index`)};
    }
    writeBufferData(output_number, indices, global_idx);
  }`,getRunData:()=>({outputs:l,dispatchGroup:{x:Math.ceil(r/64)},programUniforms:f})}},ac=(e,t)=>{ec(e.inputs);let n=e.inputs.length===1?t:tc(e.inputs,t);e.compute(ic(e.inputs,n),{inputs:[0]})},oc=e=>{let t=e.axis,n=e.splitSizes,r=e.numOutputs<0?n.length:e.numOutputs;if(r!==n.length)throw Error(`numOutputs and splitSizes length must be equal`);return V({axis:t,numOutputs:r,splitSizes:n})}}),cc,lc,uc,dc=d(()=>{L(),B(),H(),Y(),cc=(e,t)=>{let[n,r,i,a]=e,{numHeads:o,rotaryEmbeddingDim:s}=t;if(n.dims.length!==3&&n.dims.length!==4)throw Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${n.dims.length}`);if(!z.areEqual(r.dims,[])&&!z.areEqual(r.dims,[1])&&r.dims.length!==2)throw Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${r.dims.length}`);if(i.dims.length!==2)throw Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${i.dims.length}`);if(a.dims.length!==2)throw Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${a.dims.length}`);if(!z.areEqual(i.dims,a.dims))throw Error(`Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape`);if(s>0&&o===0)throw Error(`num_heads must be provided if rotary_embedding_dim is specified`);let c=n.dims[0],l=n.dims[n.dims.length-2],u=i.dims[0],d=z.sizeFromDimension(n.dims,1)/l,f=s===0?i.dims[1]*2:d/o;if(s>f)throw Error(`rotary_embedding_dim must be less than or equal to head_size`);if(r.dims.length===2){if(c!==r.dims[0])throw Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${r.dims[0]}`);if(l!==r.dims[1])throw Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${r.dims[1]}`)}if(l>u)throw Error(`Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported`);if(f/2!==i.dims[1]&&s/2!==i.dims[1])throw Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${i.dims[1]}`)},lc=(e,t)=>{let{interleaved:n,numHeads:r,rotaryEmbeddingDim:i,scale:a}=t,o=e[0].dims[0],s=z.sizeFromDimension(e[0].dims,1),c=e[0].dims[e[0].dims.length-2],l=s/c,u=e[2].dims[1],d=i===0?u*2:l/r,f=[o,c,l/d,d-u],p=z.computeStrides(f),m=[{type:1,data:a},{type:12,data:f},{type:12,data:p},...e[0].dims.length===3?Array({type:12,data:[s,l,d,1]}):[],...e[0].dims.length===4?Array({type:12,data:[s,d,c*d,1]}):[],...W(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)];return{name:`RotaryEmbedding`,shaderCache:{hint:V({interleaved:n}).cacheKey,inputDependencies:[`rank`,`rank`,`rank`,`rank`]},getShaderSource:t=>{let r=q(`input`,e[0].dataType,e[0].dims.length),i=q(`position_ids`,e[1].dataType,e[1].dims.length),a=q(`cos_cache`,e[2].dataType,e[2].dims.length),o=q(`sin_cache`,e[3].dataType,e[3].dims.length),s=J(`output`,e[0].dataType,e[0].dims.length);return t.registerUniforms([{name:`scale`,type:`f32`},{name:`global_shape`,type:`u32`,length:f.length},{name:`global_strides`,type:`u32`,length:p.length},{name:`input_output_strides`,type:`u32`,length:p.length}]),`
        ${t.declareVariables(r,i,a,o,s)}

        ${t.mainStart(En)}
          let half_rotary_emb_dim = uniforms.${a.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${t.guardAgainstOutOfBoundsWorkgroupSizes(`size`)}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${i.broadcastedIndicesToOffset(`bsnh.xy`,J(``,i.type.tensor,2))};
            let position_id =
                u32(${i.getByOffset(`position_ids_idx`)}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${n});
            let j = i + select(half_rotary_emb_dim, 1, ${n});
            let re = ${r.getByOffset(`i`)} * ${a.get(`position_id`,`bsnh[3]`)} -
                ${r.getByOffset(`j`)} * ${o.get(`position_id`,`bsnh[3]`)};
            ${s.setByOffset(`i`,`re`)}
            let im = ${r.getByOffset(`i`)} * ${o.get(`position_id`,`bsnh[3]`)} +
                ${r.getByOffset(`j`)} * ${a.get(`position_id`,`bsnh[3]`)};
            ${s.setByOffset(`j`,`im`)}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${s.setByOffset(`k`,r.getByOffset(`k`))}
          }
        }`},getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(z.size(f)/En)},programUniforms:m})}},uc=(e,t)=>{cc(e.inputs,t),e.compute(lc(e.inputs,t))}}),fc,pc,mc,hc,gc,_c=d(()=>{H(),L(),Qr(),$s(),sc(),Kn(),dc(),Y(),fc=(e,t)=>{if(t.doRotary&&e.length<=7)throw Error(`cos_cache and sin_cache inputs are required if do_rotary is specified`);let n=e[0],r=e[1],i=e[2],a=e[3],o=e[4];if(t.doRotary!==0&&e.length<=7)throw Error(`cos_cast and sin_cache are expected if do_rotary attribute is non-zero`);if(t.localWindowSize!==-1)throw Error(`Local attention is not supported`);if(t.softcap!==0)throw Error(`Softcap is not supported`);if(t.rotaryInterleaved!==0)throw Error(`Rotary interleaved is not supported`);if(t.smoothSoftmax)throw Error(`Smooth softmax is not supported`);if(n.dims.length!==3&&n.dims.length!==5)throw Error(`Input query is expected to have 3 or 5 dimensions`);let s=n.dims[0],c=n.dims[1],l=n.dims.length===3?n.dims[2]:t.numHeads*n.dims[4],u=c,d=0,f=!r||r.dims.length===0,p=Math.floor(f?l/(t.numHeads+2*t.kvNumHeads):l/t.numHeads);f&&(l=p*t.numHeads);let m=a&&a.dims.length!==0,h=o&&o.dims.length!==0;if(m&&a.dims.length===4&&a.dims[0]===s&&a.dims[1]!==t.kvNumHeads&&a.dims[2]===t.kvNumHeads&&a.dims[3]===p)throw Error(`BSNH pastKey/pastValue is not supported`);if(m&&h){if(a.dims.length!==4)throw Error(`Input "past_key" is expected to have 4 dimensions`);if(o.dims.length!==4)throw Error(`Input "past_value" is expected to have 4 dimensions`);d=a.dims[2]}else if(m||h)throw Error(`Input "past_key" and "past_value" shall be both present or both absent`);let g=1;if(r&&r.dims.length>0){if(n.dims.length!==3)throw Error(`Input "query" is expected to have 3 dimensions when key is given`);if(r.dims.length<3||r.dims.length>5)throw Error(`Input "key" is expected to have 3, 4, or 5 dimensions`);if(n.dims[0]!==r.dims[0])throw Error(`Input "query" and "key" shall have same dim 0 (batch size)`);if(r.dims.length===3){if(n.dims[2]%r.dims[2]!==0)throw Error(`Dimension 2 of "query" should be a multiple of "key"`);u=r.dims[1]}else if(r.dims.length===5){if(r.dims[2]!==t.numHeads||r.dims[3]!==2||r.dims[4]!==p)throw Error(`Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv`);if(i)throw Error(`Expect "value" be none when "key" has packed kv format.`);u=r.dims[1]}else{if(r.dims[1]!==t.numHeads||r.dims[3]!==p)throw Error(`Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key`);u=r.dims[2]}}else{if(n.dims.length!==3&&n.dims.length!==5)throw Error(`Input "query" is expected to have 3 or 5 dimensions when key is empty`);if(n.dims.length===5&&(n.dims[2]!==t.numHeads||n.dims[3]!==3))throw Error(`Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv`);g=3}let _=!1,v=t.kvNumHeads?p*t.kvNumHeads:l;if(i&&i.dims.length>0){if(i.dims.length!==3&&i.dims.length!==4)throw Error(`Input "value" is expected to have 3 or 4 dimensions`);if(n.dims[0]!==i.dims[0])throw Error(`Input "query" and "value" shall have same dim 0 (batch_size)`);if(i.dims.length===3){if(u!==i.dims[1])throw Error(`Input "key" and "value" shall have the same dim 1 (kv_sequence_length)`);v=i.dims[2]}else{if(u!==i.dims[2])throw Error(`Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)`);v=i.dims[1]*i.dims[3],_=!0}}let y=e.length>4?e[5]:void 0;if(y){if(y.dims.length===0)throw Error(`seqlens_k must be at least 1D, got scalar.`);let e=y.dims.reduce((e,t)=>e*t,1);if(e!==s)throw Error(`seqlens_k must have batch_size (${s}) elements, got ${e}.`);for(let e=0;e<y.dims.length;e++)if(y.dims[e]!==1&&y.dims[e]!==s)throw Error(`seqlens_k has unexpected shape. Each dimension must be 1 or batch_size (${s}), got dims[${e}] = ${y.dims[e]}.`)}return{batchSize:s,sequenceLength:c,pastSequenceLength:d,kvSequenceLength:u,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:l,vHiddenSize:v,headSize:p,vHeadSize:Math.floor(v/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:0,scale:t.scale,broadcastResPosBias:!1,passPastInKv:_,qkvFormat:g}},pc=V({perm:[0,2,1,3]}),mc=(e,t,n)=>{let r=t,i=n.kvNumHeads;return t.dims.length===3&&n.kvSequenceLength!==0&&(r=t.reshape([n.batchSize,n.kvSequenceLength,i,n.headSize]),r=e.compute(Un(r,pc.perm),{inputs:[r],outputs:[-1]})[0]),r},hc=(e,t,n,r)=>{let i=[`type`,`type`],a=[e*t],o=e*t,s=[{type:12,data:o},{type:12,data:t},{type:12,data:e}];return{name:`GeneratePositionIds`,shaderCache:{hint:`${e};${t}`,inputDependencies:i},getRunData:()=>({outputs:[{dims:a,dataType:7}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:s}),getShaderSource:e=>{let t=q(`seq_lens`,n.dataType,n.dims),i=q(`total_seq_lens`,r.dataType,r.dims),o=J(`pos_ids`,7,a);return`
  ${e.registerUniforms([{name:`output_size`,type:`u32`},{name:`sequence_length`,type:`u32`},{name:`batch_size`,type:`u32`}]).declareVariables(t,i,o)}
  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
    let total_sequence_length = u32(${i.getByOffset(`0`)});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${t.getByOffset(`batch_idx`)};
    let total_seqlen = seqlen + 1;
    if (is_first_prompt) {
      if (sequence_idx < total_seqlen) {
        pos_id = sequence_idx;
      } else {
        pos_id = 1;
      }
      ${o.setByOffset(`global_idx`,`pos_id`)}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${o.setByOffset(`global_idx`,`pos_id`)}
    } else if (global_idx < uniforms.batch_size) {
      ${o.setByOffset(`global_idx`,`seqlen`)}
    };
  }
  `}}},gc=(e,t)=>{let n=fc(e.inputs,t);if(e.inputs[0].dims.length===5)throw Error(`Packed QKV is not implemented`);if(e.inputs[1]?.dims.length===5)throw Error(`Packed KV is not implemented`);let r=e.inputs[0],i=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,a=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,o=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,s=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,c=e.inputs.length>4?e.inputs[5]:void 0,l=e.inputs.length>5?e.inputs[6]:void 0,u=n.kvNumHeads?n.kvNumHeads:n.numHeads,d=V({axis:2,numOutputs:3,splitSizes:[n.numHeads*n.headSize,u*n.headSize,u*n.headSize]}),[f,p,m]=!i&&!a?e.compute(ic([r],d),{inputs:[r],outputs:[-1,-1,-1]}):[r,i,a],h,g;if(t.doRotary){let r=e.compute(hc(n.batchSize,n.sequenceLength,c,l),{inputs:[c,l],outputs:[-1]})[0],i=e.inputs[7],a=e.inputs[8],o=V({interleaved:t.rotaryInterleaved!==0,numHeads:n.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),s=[f,r,i,a],u=[-1];h=e.compute(lc(s,o),{inputs:s,outputs:u})[0],s.splice(0,1,p);let d=V({interleaved:t.rotaryInterleaved!==0,numHeads:n.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});g=e.compute(lc(s,d),{inputs:s,outputs:u})[0]}let _=Zs(e,n.batchSize,n.numHeads,n.sequenceLength,n.headSize,t.doRotary?h:f,void 0,0),v=mc(e,t.doRotary?g:p,n),y=mc(e,m,n);Yr(e,_,v,y,void 0,void 0,o,s,void 0,n,c,l)}}),vc,yc,bc,xc,Sc=d(()=>{L(),B(),Kn(),Y(),vc=(e,t,n,r,i,a,o,s)=>{let c=G(a),l=c===1?`f32`:`vec${c}f`,u=c===1?`vec2f`:`mat2x${c}f`,d=i*o,f=64;d===1&&(f=256);let p=[i,o,a/c],m=[i,o,2],h=[`rank`,`type`,`type`],g=[];return g.push(...W(p,m)),e.compute({name:`InstanceNormComputeChannelScaleShift`,shaderCache:{hint:`${c};${s};${f}`,inputDependencies:h},getRunData:()=>({outputs:[{dims:m,dataType:1}],dispatchGroup:{x:d},programUniforms:g}),getShaderSource:e=>{let i=q(`x`,t.dataType,3,c),a=[i,q(`scale`,n.dataType,n.dims),q(`bias`,r.dataType,r.dims),J(`output`,1,3,2)];return`
  var<workgroup> workgroup_shared : array<${u}, ${f}>;
  const workgroup_size = ${f}u;
  ${e.declareVariables(...a)}
  ${e.mainStart(f)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${l}(0);
    var squared_sum = ${l}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${l}(${i.get(`batch`,`channel`,`h`)});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${u}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${jn(`workgroup_shared[0][0]`,c)} / f32(hight * ${c});
      let squared_sum_final = ${jn(`workgroup_shared[0][1]`,c)} / f32(hight * ${c});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${s}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`}},{inputs:[t,n,r],outputs:[-1]})[0]},yc=(e,t,n)=>{let r=t[0].dims,i=r,a=r[0],o=r[1],s=z.sizeFromDimension(r,2),c=G(s),l=z.size(i)/c,u=vc(e,t[0],t[1],t[2],a,s,o,n.epsilon),d=[a,o,s/c],f=[a,o];e.compute({name:`InstanceNormalization`,shaderCache:{hint:`${c}`,inputDependencies:[`type`,`none`]},getRunData:()=>({outputs:[{dims:i,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:[{type:12,data:l},...W(d,f,d)]}),getShaderSource:e=>{let n=q(`x`,t[0].dataType,d.length,c),r=q(`scale_shift`,1,f.length,2),i=J(`output`,t[0].dataType,d.length,c),a=[n,r,i];return`
  ${e.registerUniform(`output_size`,`u32`).declareVariables(...a)}
  ${e.mainStart()}
  ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
      let outputIndices = ${i.offsetToIndices(`global_idx`)};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${r.getByIndices(`vec2<u32>(batch, channel)`)};
      let value = ${n.getByOffset(`global_idx`)} * ${i.type.value}(scale_shift.x) + ${i.type.value}(scale_shift.y);
      ${i.setByOffset(`global_idx`,`value`)};
  }`}},{inputs:[t[0],u]})},bc=(e,t,n)=>{let r=t[0].dims,i=r,a=r[0],o=r[r.length-1],s=z.sizeFromDimension(r,1)/o,c=G(o),l=z.size(i)/c,u=[{type:12,data:s},{type:12,data:Math.floor(o/c)}],d=[`type`,`type`],f=!1,p=[0,r.length-1];for(let e=0;e<r.length-2;e++)f||=r[e+1]!==1,p.push(e+1);f&&=r[r.length-1]!==1;let m=f?e.compute(Un(e.inputs[0],p),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:r.length},(e,t)=>r[p[t]])),h=vc(e,m,t[1],t[2],a,s,o,n.epsilon);e.compute({name:`InstanceNormalizationNHWC`,shaderCache:{hint:`${c}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:i,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:u}),getShaderSource:e=>{let n=U(t[0].dataType),r=c===1?`vec2f`:`mat${c}x2f`,a=e=>{let t=e===0?`x`:`y`,r=c===1?`f32`:`vec${c}f`;switch(c){case 1:return`${n}(${r}(scale.${t}))`;case 2:return`vec2<${n}>(${r}(scale[0].${t}, scale[1].${t}))`;case 4:return`vec4<${n}>(${r}(scale[0].${t}, scale[1].${t}, scale[2].${t}, scale[3].${t}))`;default:throw Error(`Not supported compoents ${c}`)}},o=q(`input`,t[0].dataType,t[0].dims,c),s=J(`output`,t[0].dataType,i,c);return`
  @group(0) @binding(0) var<storage, read> input : array<${o.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${r}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${s.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${e.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${a(0)}, ${a(1)});
  }`}},{inputs:[t[0],h]})},xc=(e,t)=>{t.format===`NHWC`?bc(e,e.inputs,t):yc(e,e.inputs,t)}}),Cc,wc,Tc,Ec=d(()=>{L(),B(),Y(),Cc=e=>{if(!e||e.length<2)throw Error(`layerNorm requires at least 2 inputs.`)},wc=(e,t,n)=>{let r=t.simplified,i=e[0].dims,a=e[1],o=!r&&e[2],s=i,c=z.normalizeAxis(t.axis,i.length),l=z.sizeToDimension(i,c),u=z.sizeFromDimension(i,c),d=z.size(a.dims),f=o?z.size(o.dims):0;if(d!==u||o&&f!==u)throw Error(`Size of X.shape()[axis:] == ${u}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${d} and bias size of ${f}`);let p=[];for(let e=0;e<i.length;++e)e<c?p.push(i[e]):p.push(1);let m=G(u),h=[`type`,`type`],g=[{type:12,data:l},{type:1,data:u},{type:12,data:Math.floor(u/m)},{type:1,data:t.epsilon}];o&&h.push(`type`);let _=n>1,v=n>2,y=t=>{let n=U(e[0].dataType),i=[q(`x`,e[0].dataType,e[0].dims,m),q(`scale`,a.dataType,a.dims,m)];return o&&i.push(q(`bias`,o.dataType,o.dims,m)),i.push(J(`output`,e[0].dataType,s,m)),_&&i.push(J(`mean_data_output`,1,p)),v&&i.push(J(`inv_std_output`,1,p)),`
  ${t.registerUniforms([{name:`norm_count`,type:`u32`},{name:`norm_size`,type:`f32`},{name:`norm_size_vectorized`,type:`u32`},{name:`epsilon`,type:`f32`}]).declareVariables(...i)}
  ${t.mainStart()}
    ${t.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.norm_count`)}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${kn(`f32`,m)};
    var mean_square_vector = ${kn(`f32`,m)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${An(n,m,`x[h + offset]`)};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${jn(`mean_vector`,m)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${jn(`mean_square_vector`,m)} / uniforms.norm_size ${r?``:`- mean * mean`} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${An(n,m,`x[j + offset]`)};
      let f32scale = ${An(n,m,`scale[j]`)};
      output[j + offset] = ${i[0].type.value}((f32input ${r?``:`- mean`}) * inv_std_dev * f32scale
        ${o?`+ ${An(n,m,`bias[j]`)}`:``}
      );
    }

    ${_?`mean_data_output[global_idx] = mean`:``};
    ${v?`inv_std_output[global_idx] = inv_std_dev`:``};
  }`},b=[{dims:s,dataType:e[0].dataType}];return _&&b.push({dims:p,dataType:1}),v&&b.push({dims:p,dataType:1}),{name:`LayerNormalization`,shaderCache:{hint:`${m};${n};${r}`,inputDependencies:h},getRunData:()=>({outputs:b,dispatchGroup:{x:Math.ceil(l/64)},programUniforms:g}),getShaderSource:y}},Tc=(e,t)=>{Cc(e.inputs),e.compute(wc(e.inputs,t,e.outputCount))}}),Dc,Oc,kc=d(()=>{B(),Ia(),Ga(),Dc=e=>{if(!e||e.length!==2)throw Error(`MatMul requires 2 inputs.`);if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw Error(`shared dimension does not match.`)},Oc=e=>{Dc(e.inputs);let t=Wt.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw Error(`Can't use matmul on the given tensors`);let n=t[t.length-1],r=e.inputs[0].dims[e.inputs[0].dims.length-1];if(n<8&&r<8)e.compute(Fa(e.inputs,{activation:``},t));else{let i=t[t.length-2],a=z.size(e.inputs[0].dims.slice(0,-2)),o=z.size(e.inputs[1].dims.slice(0,-2));if(a!==1&&i===1&&o===1){let i=e.inputs[0].reshape([1,a,r]),o=e.inputs[1].reshape([1,r,n]),s=[1,a,n],c=[i,o];e.compute(Wa(c,{activation:``},t,s),{inputs:c})}else e.compute(Wa(e.inputs,{activation:``},t))}}}),Ac,jc,Mc,Nc,Pc,Fc=d(()=>{L(),B(),H(),Y(),Ac=(e,t)=>{if(e.length<3||e.length>4)throw Error(`MatMulNBits requires 3 or 4 inputs`);let n=e[0],r=n.dims.length;if(n.dims[r-1]!==t.k)throw Error(`The last dim of input shape does not match the k value`);let i=Math.floor((t.k+t.blockSize-1)/t.blockSize),a=t.blockSize/8*t.bits,o=e[1];if(!z.areEqual(o.dims,[t.n,i,a]))throw Error(`The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize`);let s=e[2].dims;if(z.size(s)!==t.n*i)throw Error(`scales input size error.`);if(e.length===4){let n=e[3].dims,r=t.n*(t.bits===8?i:Math.floor((i*t.bits+7)/8));if(z.size(n)!==r)throw Error(`zeroPoints input size error.`)}},jc=(e,t)=>{let n=e[0].dims,r=n.length,i=n[r-2],a=t.k,o=t.n,s=n.slice(0,r-2),c=z.size(s),l=e[1].dims[2]/4,u=e[0].dataType,d=G(t.k),f=G(l),p=G(o),m=s.concat([i,o]),h=i>1&&o/p%2==0?2:1,g=z.size(m)/p/h,_=[],v=[c,i,a/d],y=z.convertShape(e[1].dims).slice();y.splice(-1,1,l/f),_.push(...W(v)),_.push(...W(y)),_.push(...W(e[2].dims)),e.length===4&&_.push(...W(z.convertShape(e[3].dims)));let b=[c,i,o/p];return _.push(...W(b)),{name:`MatMulNBits`,shaderCache:{hint:`${t.blockSize};${t.bits};${d};${f};${p};${h};64`,inputDependencies:Array(e.length).fill(`rank`)},getRunData:()=>({outputs:[{dims:m,dataType:u}],dispatchGroup:{x:g},programUniforms:_}),getShaderSource:n=>{let r=v.length,i=q(`a`,e[0].dataType,r,d),a=q(`b`,12,y.length,f),o=q(`scales`,e[2].dataType,e[2].dims.length),s=[i,a,o],c=e.length===4?q(`zero_points`,12,e[3].dims.length):void 0;c&&s.push(c);let u=b.length,m=J(`output`,e[0].dataType,u,p),g=U(e[0].dataType),_=(()=>{switch(d){case 1:return`array<${g}, 8>`;case 2:return`mat4x2<${g}>`;case 4:return`mat2x4<${g}>`;default:throw Error(`${d}-component is not supported.`)}})(),x=Math.floor(32/t.bits),S=Math.floor(x/8),C=()=>{let e=``;for(let n=0;n<S;n++){let r=n*t.bits*4,a=r+t.bits;e+=`
          // reuse a data (pass ${n})
            var input_offset${n>0?n:``} = ${n===0?i.indicesToOffset(`${i.type.indices}(batch, row, word_offset)`):`input_offset`};
            var a_data${n>0?n:``}: ${_};
            for (var j${n>0?n:``}: u32 = 0; j${n>0?n:``} < ${8/d}; j${n>0?n:``}++) {
              a_data${n>0?n:``}[j${n>0?n:``}] = ${i.getByOffset(`input_offset${n>0?n:``}`)};
              input_offset${n>0?n:``}++;
            }
          `;for(let i=0;i<p*h;i++)e+=`
            b_value = ${f===1?`b${i}_data`:`b${i}_data[i]`};
            ${t.bits===2?`{
              let half_word = b_value >> ${n*16}u;
              let byte_lo = half_word & 0xFFu;
              let byte_hi = (half_word >> 8u) & 0xFFu;
              let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
              b_value_lower = unpack4xU8(spread_word & b_mask);
              b_value_upper = unpack4xU8((spread_word >> 2u) & b_mask);
            }`:`b_value_lower = unpack4xU8((b_value >> ${r}u) & b_mask);
            b_value_upper = unpack4xU8((b_value >> ${a}u) & b_mask);`}
            b_quantized_values = ${_}(${Array.from({length:4},(e,t)=>`${g}(b_value_lower[${t}]), ${g}(b_value_upper[${t}])`).join(`, `)});
            b_dequantized_values = ${d===1?`${_}(${Array.from({length:8},(e,t)=>`(b_quantized_values[${t}] - ${c?`zero_point${i}`:`zero_point`}) * scale${i}`).join(`, `)});`:`(b_quantized_values - ${_}(${Array(8).fill(`${c?`zero_point${i}`:`zero_point`}`).join(`,`)})) * scale${i};`};
            workgroup_shared[local_id.x * ${h} + ${Math.floor(i/p)}]${p>1?`[${i%p}]`:``} += ${Array.from({length:8/d},(e,t)=>`${d===1?`a_data${n>0?n:``}[${t}] * b_dequantized_values[${t}]`:`dot(a_data${n>0?n:``}[${t}], b_dequantized_values[${t}])`}`).join(` + `)};
          `}return e},w=()=>{let e=`
            var col_index = col * ${p};
            ${c?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (nBlocksPerCol + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is ${2**(t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${g}(${(2**(t.bits-1)).toFixed(1)});`}
            `;for(let n=0;n<p*h;n++)e+=`
            let scale${n} = ${o.getByOffset(`col_index * nBlocksPerCol + block`)};
            ${c?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            zero_point_word = ${c.getByOffset(`zero_point_word_index`)} >> zero_point_bits_offset;
            let zero_point${n} = ${g}((zero_point_word) & ${t.bits===2?`0x3u`:`0xFu`});`:``}
            col_index += 1;`;return e},T=()=>{let e=`col_index = col * ${p};`;for(let t=0;t<p*h;t++)e+=`
            let b${t}_data = ${a.getByIndices(`${a.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return e+=`
            var b_value: u32;
            let b_mask: u32 = ${t.bits===2?`0x03030303u`:`0x0F0F0F0Fu`};
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${_};
            var b_dequantized_values: ${_};`,e};return`
        var<workgroup> workgroup_shared: array<${m.type.value}, ${h*64}>;
        ${n.declareVariables(...s,m)}
        ${n.mainStart([64,1,1])}
          let output_indices = ${m.offsetToIndices(`(global_idx / 64) * ${h}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += 64) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/d};
            ${w()}
            for (var word: u32 = 0; word < ${l}; word += ${f}) {
              ${T()}
              for (var i: u32 = 0; i < ${f}; i++) {
                ${C()}
                word_offset += ${x/d};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${h}) {
            var output_value: ${m.type.value} = ${m.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < 64u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${h};
            }
            ${m.setByIndices(`${m.type.indices}(batch, row, col + local_id.x)`,`output_value`)};
          }
        }`}}},Mc=(e,t)=>{let n=e[0].dims,r=n.length,i=n[r-2],a=t.k,o=t.n,s=n.slice(0,r-2),c=z.size(s),l=e[1].dims[2]/4,u=e[0].dataType,d=G(t.k),f=G(l),p=s.concat([i,o]),m=o%8==0?8:o%4==0?4:1,h=128/m,g=Math.floor(32/t.bits),_=h*f*g,v=_/d,y=_/t.blockSize,b=z.size(p)/m,x=[],S=[c,i,a/d],C=z.convertShape(e[1].dims).slice();C.splice(-1,1,l/f),x.push(...W(S)),x.push(...W(C)),x.push(...W(e[2].dims)),e.length===4&&x.push(...W(z.convertShape(e[3].dims)));let w=[c,i,o];return x.push(...W(w)),{name:`BlockwiseMatMulNBits32`,shaderCache:{hint:`${t.blockSize};${d};${f};${h};${m}`,inputDependencies:Array(e.length).fill(`rank`)},getRunData:()=>({outputs:[{dims:p,dataType:u}],dispatchGroup:{x:b},programUniforms:x}),getShaderSource:n=>{let r=S.length,i=q(`a`,e[0].dataType,r,d),a=q(`b`,12,C.length,f),o=q(`scales`,e[2].dataType,e[2].dims.length),s=[i,a,o],c=e.length===4?q(`zero_points`,12,e[3].dims.length):void 0;c&&s.push(c);let l=w.length,u=J(`output`,e[0].dataType,l),p=U(e[0].dataType),_=()=>{switch(d){case 1:return`
          let a_data0 = vec4<${p}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${p}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${p}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${p}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw Error(`${d}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${i.type.value}, ${v}>;
        var<workgroup> inter_results: array<array<${u.type.value}, ${h}>, ${m}>;
        ${n.declareVariables(...s,u)}
        ${n.mainStart([h,m,1])}
          let output_indices = ${u.offsetToIndices(`workgroup_index * ${m}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${y} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${v};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${v}; a_offset += 128)
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${i.getByIndices(`${i.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${i.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${y} + local_id.x;
            ${c?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (n_blocks_per_col + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            let zero_point_word = ${c.getByOffset(`zero_point_word_index`)} >> zero_point_bits_offset;
            let zero_point = ${p}((zero_point_word) & ${t.bits===2?`0x3u`:`0xFu`});`:`
            // The default zero point is ${2**(t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${p}(${(2**(t.bits-1)).toFixed(1)});`}
            let scale = ${o.getByOffset(`b_row * n_blocks_per_col + block`)};
            let b_data = ${a.getByIndices(`${a.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/d};
            for (var i: u32 = 0; i < ${f}; i++) {
              let b_value = ${f===1?`b_data`:`b_data[i]`};
              ${(()=>{let e=Math.floor(g/8),n=``;for(let r=0;r<e;r++){let e=r*t.bits*4,i=e+t.bits;n+=`
              ${_()}
              {${t.bits===2?`
                let half_word = b_value >> ${r*16}u;
                let byte_lo = half_word & 0xFFu;
                let byte_hi = (half_word >> 8u) & 0xFFu;
                let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
                let b_value_lower = unpack4xU8(spread_word & 0x03030303u);
                let b_value_upper = unpack4xU8((spread_word >> 2u) & 0x03030303u);`:`
                let b_value_lower = unpack4xU8((b_value >> ${e}u) & 0x0F0F0F0Fu);
                let b_value_upper = unpack4xU8((b_value >> ${i}u) & 0x0F0F0F0Fu);`}
                let b_quantized_values = mat2x4<${p}>(${Array.from({length:4},(e,t)=>`${p}(b_value_lower[${t}]), ${p}(b_value_upper[${t}])`).join(`, `)});
                let b_dequantized_values = (b_quantized_values - mat2x4<${p}>(${Array(8).fill(`zero_point`).join(`,`)})) * scale;
                inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(e,t)=>`${`dot(a_data${t}, b_dequantized_values[${t}])`}`).join(` + `)};
              }
              word_offset += ${8/d};`}return n})()}
            }
            workgroupBarrier();
          }

          if (local_idx < ${m}) {
            var output_value: ${u.type.value} = ${u.type.value}(0);
            for (var b = 0u; b < ${h}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${u.setByIndices(`${u.type.indices}(batch, row, col + local_idx)`,`output_value`)}
            }
          }
        }`}}},Nc=(e,t)=>{Ac(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor(`intel`)&&e.adapterInfo.isArchitecture(`gen-12lp`)?e.compute(Mc(e.inputs,t)):e.compute(jc(e.inputs,t))},Pc=e=>V(e)}),Ic,Lc,Rc,zc,Bc,Vc,Hc,Uc,Wc,Gc=d(()=>{L(),B(),Y(),Ic=e=>{if(!e||e.length<1)throw Error(`Too few inputs`);if(e[0].dataType!==1&&e[0].dataType!==10)throw Error(`Input type must be float or float16.`);if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw Error(`The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].`)}},Lc=(e,t,n)=>{let r=``;for(let i=t-1;i>=0;--i)r+=`
            k = i32(${e.indicesGet(`indices`,i)}) - ${K(`uniforms.pads`,i,n)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${K(`uniforms.x_shape`,i,t)})) {
              break;
            }
            offset += k * i32(${K(`uniforms.x_strides`,i,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${r}
            value = x[offset];
          }
      `},Rc=(e,t,n)=>{let r=``;for(let i=t-1;i>=0;--i)r+=`
                k = i32(${e.indicesGet(`indices`,i)}) - ${K(`uniforms.pads`,i,n)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${K(`uniforms.x_shape`,i,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${K(`uniforms.x_shape`,i,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${K(`uniforms.x_strides`,i,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${r}
              value = x[offset];
          `},zc=(e,t,n)=>{let r=``;for(let i=t-1;i>=0;--i)r+=`
                k = i32(${e.indicesGet(`indices`,i)}) - ${K(`uniforms.pads`,i,n)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${K(`uniforms.x_shape`,i,t)})) {
                  k = i32(${K(`uniforms.x_shape`,i,t)}) - 1;
                }
                offset += k * i32(${K(`uniforms.x_strides`,i,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${r}
              value = x[offset];
          `},Bc=(e,t,n)=>{let r=``;for(let i=t-1;i>=0;--i)r+=`
                k = i32(${e.indicesGet(`indices`,i)}) - ${K(`uniforms.pads`,i,n)};
                if (k < 0)  {
                  k += i32(${K(`uniforms.x_shape`,i,t)}]);
                }
                if (k >= i32(${K(`uniforms.x_shape`,i,t)})) {
                  k -= i32(${K(`uniforms.x_shape`,i,t)});
                }
                offset += k * i32(${K(`uniforms.x_strides`,i,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${r}
              value = x[offset];
          `},Vc=(e,t,n)=>{switch(n.mode){case 0:return Lc(e,t,n.pads.length);case 1:return Rc(e,t,n.pads.length);case 2:return zc(e,t,n.pads.length);case 3:return Bc(e,t,n.pads.length);default:throw Error(`Invalid mode`)}},Hc=(e,t)=>{let n=z.padShape(e[0].dims.slice(),t.pads),r=e[0].dims,i=[{type:12,data:z.size(n)},{type:6,data:t.pads}],a=e.length>=3&&e[2].data;return t.mode===0&&i.push({type:a?e[2].dataType:1,data:t.value}),i.push(...W(e[0].dims,n)),{name:`Pad`,shaderCache:{hint:`${t.mode}${a}`,inputDependencies:[`rank`]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(z.size(n)/64)},programUniforms:i}),getShaderSource:i=>{let o=J(`output`,e[0].dataType,n.length),s=q(`x`,e[0].dataType,r.length),c=s.type.value,l=Vc(o,r.length,t),u=[{name:`output_size`,type:`u32`},{name:`pads`,type:`i32`,length:t.pads.length}];return t.mode===0&&u.push({name:`constant_value`,type:a?c:`f32`}),`
            ${i.registerUniforms(u).declareVariables(s,o)}
            ${i.mainStart()}
            ${i.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}

            let indices = ${o.offsetToIndices(`global_idx`)};

            var value = ${c}(0);
            ${l}
            output[global_idx] = value;
        }`}}},Uc=(e,t)=>{if(e.length>1){let n=e[1].getBigInt64Array(),r=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,i=e[0].dims.length,a=new Int32Array(2*i).fill(0);if(e.length>=4){let t=e[3].getBigInt64Array();for(let e=0;e<t.length;e++)a[Number(t[e])]=Number(n[e]),a[Number(t[e])+i]=Number(n[e+t.length])}else n.forEach((e,t)=>a[Number(t)]=Number(e));let o=[];return a.forEach(e=>o.push(e)),{mode:t.mode,value:r,pads:o}}return t},Wc=(e,t)=>{Ic(e.inputs);let n=Uc(e.inputs,t);e.compute(Hc(e.inputs,n),{inputs:[0]})}}),Kc,qc,Jc,Yc,Xc,Zc,Qc,$c,el,tl,nl,rl,il,al,ol,sl,cl,ll,ul,dl=d(()=>{Ne(),L(),B(),Y(),Kc=e=>{if(D.webgpu.validateInputContent&&(!e||e.length!==1))throw Error(`Pool ops requires 1 input.`)},qc=(e,t,n)=>{let r=t.format===`NHWC`,i=e.dims.slice();r&&i.splice(1,0,i.pop());let a=Object.hasOwnProperty.call(t,`dilations`),o=t.kernelShape.slice(),s=t.strides.slice(),c=a?t.dilations.slice():[],l=t.pads.slice();Gt.adjustPoolAttributes(n,i,o,s,c,l);let u=Gt.computePoolOutputShape(n,i,s,c,o,l,t.autoPad),d=Object.assign({},t);a?Object.assign(d,{kernelShape:o,strides:s,pads:l,dilations:c,cacheKey:t.cacheKey}):Object.assign(d,{kernelShape:o,strides:s,pads:l,cacheKey:t.cacheKey});let f=u.slice();return f.push(f.splice(1,1)[0]),[d,r?f:u]},Jc=(e,t)=>{let n=t.format===`NHWC`,r=z.size(e),i=z.size(t.kernelShape),a=[{type:12,data:r},{type:12,data:i}],o=[{name:`outputSize`,type:`u32`},{name:`kernelSize`,type:`u32`}];if(t.kernelShape.length<=2){let e=t.kernelShape[t.kernelShape.length-1],n=t.strides[t.strides.length-1],r=t.pads[t.pads.length/2-1],i=t.pads[t.pads.length-1],s=!!(r+i);a.push({type:12,data:e},{type:12,data:n},{type:12,data:r},{type:12,data:i}),o.push({name:`kw`,type:`u32`},{name:`sw`,type:`u32`},{name:`pwStart`,type:`u32`},{name:`pwEnd`,type:`u32`});let c=!1;if(t.kernelShape.length===2){let e=t.kernelShape[t.kernelShape.length-2],n=t.strides[t.strides.length-2],r=t.pads[t.pads.length/2-2],i=t.pads[t.pads.length-2];c=!!(r+i),a.push({type:12,data:e},{type:12,data:n},{type:12,data:r},{type:12,data:i}),o.push({name:`kh`,type:`u32`},{name:`sh`,type:`u32`},{name:`phStart`,type:`u32`},{name:`phEnd`,type:`u32`})}return[a,o,!0,s,c]}{if(n)throw Error(`Pooling with kernelShape.length > 2 is not supported for NHWC format.`);let e=z.computeStrides(t.kernelShape);return a.push({type:12,data:e},{type:12,data:t.pads},{type:12,data:t.strides}),o.push({name:`kernelStrides`,type:`u32`,length:e.length},{name:`pads`,type:`u32`,length:t.pads.length},{name:`strides`,type:`u32`,length:t.strides.length}),[a,o,!!t.pads.reduce((e,t)=>e+t),!1,!1]}},Yc=(e,t,n,r,i,a,o,s,c,l,u,d)=>{let f=i.format===`NHWC`,p=t.type.value,m=J(`output`,t.type.tensor,r);if(i.kernelShape.length<=2){let r=``,l=``,h=``,g=n-(f?2:1);if(r=u?`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${g}] = indices[${g}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${g}] < 0 || xIndices[${g}]
                      >= uniforms.x_shape[${g}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset(`xIndices`)}];
                  ${a}
                }`:`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${g}] = indices[${g}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset(`xIndices`)}];
                  ${a}
                }`,i.kernelShape.length===2){let e=n-(f?3:2);l=d?`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${e}] = indices[${e}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${e}] < 0 || xIndices[${e}] >= uniforms.x_shape[${e}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${e}] = indices[${e}] * uniforms.sh - uniforms.phStart + j;
                `,h=`
              }
            `}return`
            ${e.registerUniforms(c).declareVariables(t,m)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}

              let indices = ${m.offsetToIndices(`global_idx`)};
              var xIndices = ${m.offsetToIndices(`global_idx`)};

              var value = ${p}(${s});
              var pad = 0;
              ${l}
              ${r}
              ${h}
              ${o}

              output[global_idx] = value;
            }`}{if(f)throw Error(`Pooling with kernelShape.length > 2 is not supported for NHWC format.`);let r=i.kernelShape.length,u=i.pads.length,d=``;return d=l?`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset(`xIndices`)}];
                ${a}
              }`:`
              }
              let x_val = x[${t.indicesToOffset(`xIndices`)}];
              ${a}
            `,`
            ${e.registerUniforms(c).declareVariables(t,m)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}
              let indices = ${m.offsetToIndices(`global_idx`)};
              var xIndices = ${m.offsetToIndices(`global_idx`)};

              var offsets: array<u32, ${r}>;

              var value = ${p}(${s});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${r-1}u; j++) {
                  offsets[j] = offset / ${K(`uniforms.kernelStrides`,`j`,r)};
                  offset -= offsets[j] * ${K(`uniforms.kernelStrides`,`j`,r)};
                }
                offsets[${r-1}] = offset;

                isPad = false;
                for (var j = ${n-r}u; j < ${n}u; j++) {
                  xIndices[j] = indices[j] * ${K(`uniforms.strides`,`j - ${n-r}u`,r)}
                    + offsets[j - ${n-r}u] - ${K(`uniforms.pads`,`j - 2u`,u)};
                  ${d}
              }
              ${o}

              output[global_idx] = value;
            }`}},Xc=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,Zc=e=>`${Xc(e)};${e.countIncludePad}`,Qc=e=>`${Xc(e)};${e.storageOrder};${e.dilations}`,$c=e=>({format:e.format,autoPad:[`NOTSET`,`VALID`,`SAME_UPPER`,`SAME_LOWER`][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),el=(e,t,n,r)=>{let[i,a]=qc(t,r,n),o=q(`x`,t.dataType,t.dims.length),s=o.type.value,c=``;i.countIncludePad?c+=`value /= ${s}(uniforms.kernelSize);`:c+=`value /= ${s}(i32(uniforms.kernelSize) - pad);`;let[l,u,d,f,p]=Jc(a,i);return l.push(...W(t.dims,a)),{name:e,shaderCache:{hint:`${r.cacheKey};${d};${f};${p}`,inputDependencies:[`rank`]},getRunData:()=>({outputs:[{dims:a,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(z.size(a)/64)},programUniforms:l}),getShaderSource:e=>Yc(e,o,t.dims.length,a.length,i,`value += x_val;`,c,0,u,d,f,p)}},tl=e=>{let t=e.count_include_pad!==0,n=$c(e);if(n.ceilMode!==0)throw Error(`using ceil() in shape computation is not yet supported for AveragePool`);let r={countIncludePad:t,...n,cacheKey:``};return{...r,cacheKey:Zc(r)}},nl=(e,t)=>{Kc(e.inputs),e.compute(el(`AveragePool`,e.inputs[0],!1,t))},rl={autoPad:``,ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},il=e=>{let t=e.format;return{format:t,...rl,cacheKey:t}},al=(e,t)=>{Kc(e.inputs),e.compute(el(`GlobalAveragePool`,e.inputs[0],!0,t))},ol=(e,t,n,r)=>{let[i,a]=qc(t,r,n),o=q(`x`,t.dataType,t.dims.length),s=[`rank`],[c,l,u,d,f]=Jc(a,i);return c.push(...W(t.dims,a)),{name:e,shaderCache:{hint:`${r.cacheKey};${u};${d};${f}`,inputDependencies:s},getRunData:()=>({outputs:[{dims:a,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(z.size(a)/64)},programUniforms:c}),getShaderSource:e=>Yc(e,o,t.dims.length,a.length,i,`
      value = max(x_val, value);
    `,``,t.dataType===10?-65504:-1e5,l,u,d,f)}},sl=(e,t)=>{Kc(e.inputs),e.compute(ol(`MaxPool`,e.inputs[0],!1,t))},cl=e=>{let t=e.storage_order,n=e.dilations,r=$c(e);if(t!==0)throw Error(`column major storage order is not yet supported for MaxPool`);if(r.ceilMode!==0)throw Error(`using ceil() in shape computation is not yet supported for MaxPool`);let i={storageOrder:t,dilations:n,...r,cacheKey:``};return{...i,cacheKey:Qc(i)}},ll=e=>{let t=e.format;return{format:t,...rl,cacheKey:t}},ul=(e,t)=>{Kc(e.inputs),e.compute(ol(`GlobalMaxPool`,e.inputs[0],!0,t))}}),fl,pl,ml,hl,gl=d(()=>{L(),B(),H(),Y(),fl=(e,t)=>{if(e.length<2||e.length>3)throw Error(`DequantizeLinear requires 2 or 3 inputs.`);if(e.length===3&&e[1].dims===e[2].dims)throw Error(`x-scale and x-zero-point must have the same shape.`);if(e.length===3&&e[0].dataType!==e[2].dataType)throw Error(`x and x-zero-point must have the same data type.`);if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw Error(`scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.`);if(e.length>2){if(e[0].dataType!==e[2].dataType)throw Error(`x and x-zero-point must have the same data type.`);if(e[1].dims.length!==e[2].dims.length)throw Error(`scale and zero-point inputs must have the same rank.`);if(!e[1].dims.map((t,n)=>t===e[2].dims[n]).reduce((e,t)=>e&&t,!0))throw Error(`scale and zero-point inputs must have the same shape.`)}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw Error(`blockSize must be set only for block quantization.`);if(!e[1].dims.map((n,r)=>r===t.axis||n===e[0].dims[r]).reduce((e,t)=>e&&t,!0))throw Error(`For block qunatization, scale input shape to match the input shape except for the axis`);if(e[1].dims.length!==e[0].dims.length)throw Error(`For block qunatization the scale input rank must be the same as the x rank.`);let n=e[0].dims[t.axis],r=e[1].dims[t.axis];if(t.blockSize<Math.ceil(n/r)||t.blockSize>Math.ceil(n/(r-1)-1))throw Error(`blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].`)}},pl=(e,t)=>{let n=z.normalizeAxis(t.axis,e[0].dims.length),r=e[0].dataType,i=r===3,a=e[0].dims,o=e[1].dataType,s=z.size(a),c=r===3||r===2,l=c?[Math.ceil(z.size(e[0].dims)/4)]:e[0].dims,u=e[1].dims,d=e.length>2?e[2]:void 0,f=d?c?[Math.ceil(z.size(d.dims)/4)]:d.dims:void 0,p=u.length===0||u.length===1&&u[0]===1,m=p===!1&&u.length===1,h=G(s),g=p&&(!c||h===4),_=g?h:1,v=g&&!c?h:1,y=q(`input`,c?12:r,l.length,v),b=q(`scale`,o,u.length),x=d?q(`zero_point`,c?12:r,f.length):void 0,S=J(`output`,o,a.length,_),C=[y,b];x&&C.push(x);let w=[l,u];d&&w.push(f);let T=[{type:12,data:s/_},{type:12,data:n},{type:12,data:t.blockSize},...W(...w,a)];return{name:`DequantizeLinear`,shaderCache:{hint:t.cacheKey,inputDependencies:x?[`rank`,`rank`,`rank`]:[`rank`,`rank`]},getShaderSource:e=>`
      ${e.registerUniforms([{name:`output_size`,type:`u32`},{name:`axis`,type:`u32`},{name:`block_size`,type:`u32`}]).declareVariables(...C,S)}
      ${e.mainStart()}
          ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
          let output_indices = ${S.offsetToIndices(`global_idx`)};

          // Set input x
          ${c?`
            let input = ${y.getByOffset(`global_idx / 4`)};
            let x_vec = ${i?`unpack4xI8(input)`:`unpack4xU8(input)`};
            let x_value = ${_===1?`x_vec[global_idx % 4]`:`x_vec`};`:`let x_value = ${y.getByOffset(`global_idx`)};`};

          // Set scale input
          ${p?`let scale_value= ${b.getByOffset(`0`)}`:m?`
            let scale_index = ${S.indicesGet(`output_indices`,`uniforms.axis`)};
            let scale_value= ${b.getByOffset(`scale_index`)};`:`
            var scale_indices: ${b.type.indices} = output_indices;
            let index = ${b.indicesGet(`scale_indices`,`uniforms.axis`)} / uniforms.block_size;
            ${b.indicesSet(`scale_indices`,`uniforms.axis`,`index`)};
            let scale_value= ${b.getByIndices(`scale_indices`)};`};

          // Set zero-point input
          ${x?p?c?`
                let zero_point_input = ${x.getByOffset(`0`)};
                let zero_point_vec =  ${i?`unpack4xI8(zero_point_input)`:`unpack4xU8(zero_point_input)`};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${x.getByOffset(`0`)}`:m?c?`
                let zero_point_index = ${S.indicesGet(`output_indices`,`uniforms.axis`)};
                let zero_point_input = ${x.getByOffset(`zero_point_index / 4`)};
                let zero_point_vec =  ${i?`unpack4xI8(zero_point_input)`:`unpack4xU8(zero_point_input)`};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${S.indicesGet(`output_indices`,`uniforms.axis`)};
                let zero_point_value = ${x.getByOffset(`zero_point_index`)};`:c?`
                let zero_point_offset = ${b.indicesToOffset(`scale_indices`)};
                let zero_point_input = ${x.getByOffset(`zero_point_offset / 4`)};
                let zero_point_vec = ${i?`unpack4xI8(zero_point_input)`:`unpack4xU8(zero_point_input)`};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${x.getByIndices(`scale_indices`)};`:`let zero_point_value = ${c?i?`i32`:`u32`:y.type.value}(0);`};
      // Compute and write output
      ${S.setByOffset(`global_idx`,`${S.type.value}(x_value - zero_point_value) * scale_value`)};
      }`,getRunData:()=>({outputs:[{dims:a,dataType:o}],dispatchGroup:{x:Math.ceil(s/_/64),y:1,z:1},programUniforms:T})}},ml=(e,t)=>{fl(e.inputs,t),e.compute(pl(e.inputs,t))},hl=e=>V({axis:e.axis,blockSize:e.blockSize})}),_l,vl,yl,bl=d(()=>{Ne(),L(),Y(),_l=(e,t,n)=>{if(e===t||e<t&&n<0||e>t&&n>0)throw Error(`Range these inputs' contents are invalid.`)},vl=(e,t,n,r)=>{let i=Math.abs(Math.ceil((t-e)/n)),a=[i],o=i,s=[{type:12,data:o},{type:r,data:e},{type:r,data:n},...W(a)];return{name:`Range`,shaderCache:{hint:`${r}`},getShaderSource:e=>{let t=J(`output`,r,a.length),n=t.type.value,i=[{name:`outputSize`,type:`u32`},{name:`start`,type:n},{name:`delta`,type:n}];return`
        ${e.registerUniforms(i).declareVariables(t)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}
        output[global_idx] = uniforms.start + ${n}(global_idx) * uniforms.delta;
      }`},getRunData:()=>({outputs:[{dims:a,dataType:r}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:s})}},yl=e=>{let t=0,n=0,r=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],n=e.inputs[1].getInt32Array()[0],r=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],n=e.inputs[1].getFloat32Array()[0],r=e.inputs[2].getFloat32Array()[0]),D.webgpu.validateInputContent&&_l(t,n,r),e.compute(vl(t,n,r,e.inputs[0].dataType),{inputs:[]})}}),xl,Sl,Cl,wl,Tl=d(()=>{L(),B(),H(),Y(),xl=(e,t,n,r)=>{if(e!==`none`&&r!==`i32`&&r!==`u32`&&r!==`f32`)throw Error(`Input ${r} is not supported with reduction ${e}.`);let i=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,a=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(e){case`none`:return`${t}=${n};`;case`add`:return r===`i32`||r===`u32`?`atomicAdd(&${t}, bitcast<${r}>(${n}));`:`
              ${i}bitcast<${r}>(oldValue) + (${n})${a}`;case`max`:return r===`i32`||r===`u32`?`atomicMax(&${t}, bitcast<${r}>(${n}));`:`
                ${i}max(bitcast<f32>(oldValue), (${n}))${a}`;case`min`:return r===`i32`||r===`u32`?`atomicMin(&${t}, bitcast<${r}>(${n}));`:`${i}min(bitcast<${r}>(oldValue), (${n}))${a}`;case`mul`:return`${i}(bitcast<${r}>(oldValue) * (${n}))${a}`;default:throw Error(`Reduction ${e} is not supported.`)}},Sl=(e,t)=>{let n=e[0].dims,r=e[1].dims,i=n,a=Math.ceil(z.sizeToDimension(r,r.length-1)/1),o=r[r.length-1],s=z.sizeFromDimension(n,o),c=[{type:12,data:a},{type:12,data:o},{type:12,data:s},...W(e[1].dims,e[2].dims,i)];return{name:`ScatterND`,shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:[`rank`,`rank`]},getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:c}),getShaderSource:n=>{let r=q(`indices`,e[1].dataType,e[1].dims.length),a=q(`updates`,e[2].dataType,e[2].dims.length,1),o=t.reduction!==`none`&&t.reduction!==``?Nn(`output`,e[0].dataType,i.length):J(`output`,e[0].dataType,i.length,1);return`
      ${n.registerUniform(`output_size`,`u32`).registerUniform(`last_index_dimension`,`u32`).registerUniform(`num_updates_elements`,`u32`).declareVariables(r,a,o)}
      ${n.mainStart()}
        ${n.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
  var data_offset = 0u;
  let indices_start = uniforms.last_index_dimension * global_idx;
  let indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${e[0].dims.length===1?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[i - indices_start];
    let dim_value = uniforms.output_shape[i - indices_start];`}
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));
  }

  for (var i = 0u; i < uniforms.num_updates_elements; i++) {
    let value = updates[uniforms.num_updates_elements * global_idx + i];
    ${xl(t.reduction,`output[data_offset + i]`,`value`,o.type.value)}
  }

      }`}}},Cl=e=>V({reduction:e.reduction}),wl=(e,t)=>{e.compute(Sl(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),El,Dl,Ol,kl,Al,jl,Ml,Nl,Pl,Fl,Il,Ll,Rl,zl,Bl,Vl,Hl,Ul,Wl,Gl,Kl=d(()=>{L(),B(),H(),Y(),El=(e,t)=>{if(e.every(e=>e>0||(()=>{throw Error(`Resize requires scales input values to be positive`)})),e.length>0){if(t.mode===`linear`){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode===`cubic`&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw Error(`Resize requires scales input size to be 2 or 4 for cubic mode`)}},Dl=(e,t,n)=>{t.every(e=>e>=0&&e<n||(()=>{throw Error(`Resize requires axes input values to be positive and less than rank`)}));let r=Array(n).fill(1);return t.forEach((t,n)=>r[t]=e[n]),r},Ol=(e,t,n,r,i,a)=>{let[o,s,c]=n>10?[1,2,3]:[-1,e.length>1?1:-1,-1],l=e[0].dims.length;if(o>0&&e.length>o&&e[o].dims.length>0)e[o].getFloat32Array().forEach(e=>a.push(e));else if(t.coordinateTransformMode===`tf_crop_and_resize`)throw Error(`Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize`);if(s>0&&e.length>s&&e[s].dims.length===1&&e[s].dims[0]>0){if(e[s].getFloat32Array().forEach(e=>r.push(e)),r.length!==0&&r.length!==l&&n>=18&&r.length!==t.axes.length)throw Error(`Resize requires scales input size to be same as input rank or axes size for opset 18 and up`);El(r,t),t.axes.length>0&&Dl(r,t.axes,l).forEach((e,t)=>r[t]=e)}if(c>0&&e.length>c&&e[c].dims.length===1&&e[c].dims[0]>0&&(e[c].getBigInt64Array().forEach(e=>i.push(Number(e))),i.length!==0&&i.length!==l&&n>=18&&i.length!==t.axes.length))throw Error(`Resize requires sizes input size to be same as input rank or axes size for opset 18 and up`);if(t.axes.length>0){if(r.length!==0&&r.length!==t.axes.length)throw Error(`Resize requires "scales" input size to be of axes rank when axes attributes is specified`);if(i.length!==0&&i.length!==t.axes.length)throw Error(`Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified`)}if(typeof r<`u`&&typeof i<`u`&&r.length>0&&i.length>l)throw Error(`Resize requires only of scales or sizes to be specified`)},kl=(e,t,n,r)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${r}(big / (${n}));
  let fract = ${r}(big % (${n})) / ${r}(${n});
  return whole + fract;
`,Al=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case`asymmetric`:return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${kl(`xResized`,`lengthOriginal`,`lengthResized`,t)}
          }
        `;case`pytorch_half_pixel`:return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case`tf_half_pixel_for_nn`:return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case`align_corners`:return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${kl(`xResized`,`lengthOriginal - 1`,`lengthResized - 1`,t)}
                  }`;case`tf_crop_and_resize`:return`if (lengthResized > 1) {
                    return ${t}(roiStart) * ${t}(lengthOriginal - 1) +
                        (${t}(xResized) * ${t}(roiEnd - roiStart) * ${t}(lengthOriginal - 1)) /
                        ${t}(lengthResized - 1);
                  } else {
                    return 0.5 * ${t}(roiStart + roiEnd) * ${t}(lengthOriginal - 1);
                  }`;case`half_pixel_symmetric`:return`const outputWidth = ${t}xScale * ${t}(lengthResized);
                  const adjustment = ${t}(lengthResized) / outputWidth;
                  const center = ${t}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case`half_pixel`:return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw Error(`Coordinate transform mode ${e} is not supported`)}})()+`}`,jl=(e,t,n)=>`fn getNearestPixelFromOriginal(xOriginal: ${n}, isDownSample: bool) -> ${n} {`+(()=>{switch(e){case`round_prefer_ceil`:return`if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }`;case`floor`:return`return floor(xOriginal);`;case`ceil`:return`return ceil(xOriginal);`;case`round_prefer_floor`:return`if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }`;default:if(t<11)return`if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }`;throw Error(`Nearest mode ${e} is not supported`)}})()+`}`,Ml=(e,t,n)=>{let r=Array(n).fill(0).concat(Array(n).fill(1)),i=e.length===0?r:e.slice();return t.length>0?(t.forEach((e,a)=>{r[e]=i[a],r[a+n]=i[t.length+a]}),r):i},Nl=(e,t,n,r)=>{let i=[];if(n.length>0){if(r.length>0){if(e.forEach(e=>i.push(e)),Math.max(...r)>e.length)throw Error(`axes is out of bound`);r.forEach((e,t)=>i[e]=n[t])}else n.forEach(e=>i.push(e))}else{if(t.length===0)throw Error(`Resize requires either scales or sizes.`);i=e.map((e,n)=>Math.round(e*t[n]))}return i},Pl=(e,t,n)=>{let r=(()=>{switch(n.keepAspectRatioPolicy){case`not_larger`:return n.axes.length>0?Math.min(...n.axes.map(e=>t[e]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case`not_smaller`:return n.axes.length>0?Math.max(...n.axes.map(e=>t[e]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw Error(`Keep aspect ratio policy ${n.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let i=e.slice();return n.axes.length>0?(n.axes.forEach(e=>t[e]=r),n.axes.forEach(n=>i[n]=Math.round(e[n]*t[n]))):(t.fill(r,0,t.length),i.forEach((e,n)=>i[n]=Math.round(e*t[n]))),i},Fl=(e,t,n,r,i)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${n.length}> {
      var original_indices: array<${e.type.value}, ${n.length}>;
      for (var i:u32 = 0; i < ${n.length}; i++) {
        var output_index = ${e.indicesGet(`output_indices`,`i`)};
        var scale = ${K(`uniforms.scales`,`i`,r)};
        var roi_low = ${K(`uniforms.roi`,`i`,i)};
        var roi_hi = ${K(`uniforms.roi`,`i + ${t.length}`,i)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${K(`uniforms.input_shape`,`i`,t.length)};
          var output_shape_i = ${K(`uniforms.output_shape`,`i`,n.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,Il=(e,t,n,r,i,a,o)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${t.indicesGet(`output_indices`,`i`)};
        var input_index: u32;
        var scale = ${K(`uniforms.scales`,`i`,i)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${K(`uniforms.roi`,`i`,a)};
          var roi_hi = ${K(`uniforms.roi`,`i + ${n.length}`,a)};
          var input_shape_i = ${K(`uniforms.input_shape`,`i`,n.length)};
          var output_shape_i = ${K(`uniforms.output_shape`,`i`,r.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${o} || (original_idx >= 0 && original_idx < ${t.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${t.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${e.indicesSet(`input_indices`,`i`,`input_index`)}
      }
      return input_indices;
    }`,Ll=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet(`input_indices`,`i`)};
        if (input_index < 0 || input_index >= ${K(`uniforms.input_shape`,`i`,t.length)}) {
          return false;
        }
      }
      return true;
    }`,Rl=(e,t,n,r)=>e.rank>r?`
    ${e.indicesSet(`input_indices`,t,`channel`)};
    ${e.indicesSet(`input_indices`,n,`batch`)};
`:``,zl=(e,t,n,r,i)=>{let[a,o,s,c]=n.length===2?[-1,0,1,-1]:[0,2,3,1],l=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${l} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet(`input_indices`,o,`max(0, min(row, ${n[o]} - 1))`)};
      ${e.indicesSet(`input_indices`,s,`max(0, min(col, ${n[s]} - 1))`)};
      ${Rl(e,c,a,2)}
      return ${e.getByIndices(`input_indices`)};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${l} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${l} = originalIndices[${o}];
      var col:${l} = originalIndices[${s}];
      ${r?`if (row < 0 || row > (${n[o]} - 1) || col < 0 || col > (${n[s]} - 1)) {
        return ${i};
      }`:``};
      row = max(0, min(row, ${n[o]} - 1));
      col = max(0, min(col, ${n[s]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${n.length>2?`u32(originalIndices[${c}])`:`0`};
      var batch: u32 =  ${n.length>2?`u32(originalIndices[${a}])`:`0`};
      var x11: ${l} = getInputValue(batch, channel, row1, col1);
      var x12: ${l} = getInputValue(batch, channel, row1, col2);
      var x21: ${l} = getInputValue(batch, channel, row2, col1);
      var x22: ${l} = getInputValue(batch, channel, row2, col2);
      var dx1: ${l} = abs(row - ${l}(row1));
      var dx2: ${l} = abs(${l}(row2) - row);
      var dy1: ${l} = abs(col - ${l}(col1));
      var dy2: ${l} = abs(${l}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},Bl=(e,t,n,r,i,a,o,s,c,l)=>{let[u,d]=n.length===2?[0,1]:[2,3],f=e.type.value,p=o=>{let d=o===u?`row`:`col`;return`
      fn ${d}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${f} {
        var output_index = ${t.indicesGet(`output_indices`,o)};
        var originalIdx: ${f} = getOriginalCoordinateFromResizedCoordinate(output_index, ${i[o]},
        ${r[o]}, ${n[o]}, ${a[o]}, ${a[o]} + ${n.length});
        var fractOriginalIdx: ${f} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${s} && (originalIdx < 0 || originalIdx > (${n[o]} - 1))) {
          return ${c};
        }
        var data: array<${f}, 4> = array<${f}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${d}: ${f} = originalIdx + ${f}(i);
          if (${d} < 0 || ${d} >= ${n[o]}) {
            ${l?`coefs[i + 1] = 0.0;
                        continue;`:s?`return ${c};`:`${d} = max(0, min(${d}, ${n[o]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet(`input_indices_copy`,o,`u32(${d})`)};
          data[i + 1] = ${o===u?e.getByIndices(`input_indices_copy`):`rowCubicInterpolation(input_indices_copy, output_indices)`};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${p(u)};
    ${p(d)};
  fn getCubicInterpolationCoefs(s: ${f}) -> array<${f}, 4> {
    var absS = abs(s);
    var coeffs: array<${f}, 4> = array<${f}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${f} = 1.0 - absS;
    var twoMinusAbsS: ${f} = 2.0 - absS;
    var onePlusAbsS: ${f} = 1.0 + absS;
    coeffs[0] = ((${o} * onePlusAbsS - 5 * ${o}) * onePlusAbsS + 8 * ${o}) * onePlusAbsS - 4 * ${o};
    coeffs[1] = ((${o} + 2) * absS - (${o} + 3)) * absS * absS + 1;
    coeffs[2] = ((${o} + 2) * oneMinusAbsS - (${o} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${o} * twoMinusAbsS - 5 * ${o}) * twoMinusAbsS + 8 * ${o}) * twoMinusAbsS - 4 * ${o};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${f}, 4>, coefs: array<${f}, 4>) -> ${f} {
    var coefsSum: ${f} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${f} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},Vl=(e,t,n,r,i)=>{let[a,o,s,c,l]=n.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],u=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${u} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet(`input_indices`,o,`max(0, min(depth, ${n[o]} - 1))`)};
      ${e.indicesSet(`input_indices`,s,`max(0, min(height, ${n[s]} - 1))`)};
      ${e.indicesSet(`input_indices`,c,`max(0, min(width, ${n[c]} - 1))`)};
      ${Rl(e,l,a,3)}
      return ${e.getByIndices(`input_indices`)};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${u} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${u} = originalIndices[${o}];
      var height:${u} = originalIndices[${s}];
      var width:${u} = originalIndices[${c}];
      ${r?`if (depth < 0 || depth > (${n[o]} - 1) || height < 0 || height > (${n[s]} - 1) || width < 0 || (width > ${n[c]} - 1)) {
      return ${i};
        }`:``};

    depth = max(0, min(depth, ${n[o]} - 1));
      height = max(0, min(height, ${n[s]} - 1));
      width = max(0, min(width, ${n[c]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${n.length>3?`u32(originalIndices[${l}])`:`0`};
      var batch: u32 =  ${n.length>3?`u32(originalIndices[${a}])`:`0`};

      var x111: ${u} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${u} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${u} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${u} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${u} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${u} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${u} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${u} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${u} = abs(depth - ${u}(depth1));
      var dx2: ${u} = abs(${u}(depth2) - depth);
      var dy1: ${u} = abs(height - ${u}(height1));
      var dy2: ${u} = abs(${u}(height2) - height);
      var dz1: ${u} = abs(width - ${u}(width1));
      var dz2: ${u} = abs(${u}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`},Hl=(e,t,n,r,i,a)=>{let o=e.dims,s=Ml(a,t.axes,o.length),c=Nl(o,r,i,t.axes),l=r.slice();r.length===0&&(l=o.map((e,t)=>e===0?1:c[t]/e),t.keepAspectRatioPolicy!==`stretch`&&(c=Pl(o,l,t)));let u=J(`output`,e.dataType,c.length),d=q(`input`,e.dataType,o.length),f=z.size(c),p=o.length===c.length&&o.every((e,t)=>e===c[t]),m=t.coordinateTransformMode===`tf_crop_and_resize`,h=t.extrapolationValue,g=d.type.value;return{name:`Resize`,shaderCache:{hint:`${t.cacheKey}|${n}|${l.length>0?t.mode===`cubic`?l:l.length:``}|${i.length>0?i:``}|${s.length>0?s:``}|${p}|${t.mode===`nearest`?o.length:o}`,inputDependencies:[`rank`]},getShaderSource:e=>`
      ${p?``:`
      ${Al(t.coordinateTransformMode,g)};
      ${(()=>{switch(t.mode){case`nearest`:return`
              ${Ll(d,o)};
              ${jl(t.nearestMode,n,g)};
              ${Il(d,u,o,c,l.length,s.length,m)};
              `;case`linear`:return`
              ${Fl(u,o,c,l.length,s.length)};
              ${(()=>{if(o.length===2||o.length===4)return`${zl(d,u,o,m,h)}`;if(o.length===3||o.length===5)return`${Vl(d,u,o,m,h)}`;throw Error(`Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.`)})()};
            `;case`cubic`:return`
            ${(()=>{if(o.length===2||o.length===4)return`${Bl(d,u,o,c,l,s,t.cubicCoeffA,m,t.extrapolationValue,t.excludeOutside)}`;throw Error(`Cubic mode only supports input dims 2 and 4 are supported in linear mode.`)})()};
            `;default:throw Error(`Invalid resize mode`)}})()};
      `}
      ${e.registerUniform(`output_size`,`u32`).registerUniform(`scales`,`f32`,l.length).registerUniform(`roi`,`f32`,s.length).declareVariables(d,u)}
      ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
        ${p?`output[global_idx] = input[global_idx];`:`
        let output_indices = ${u.offsetToIndices(`global_idx`)};
        var input_indices: ${d.type.indices};
        ${(()=>{switch(t.mode){case`nearest`:return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${d.getByIndices(`input_indices`)};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case`linear`:return`output[global_idx] = ${o.length===2||o.length===4?`bilinearInterpolation`:`trilinearInterpolation`}(output_indices);`;case`cubic`:return`output[global_idx] = bicubicInterpolation(output_indices);`;default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`,getRunData:()=>({outputs:[{dims:c,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:[{type:12,data:f},{type:1,data:l},{type:1,data:s},...W(o,c)]})}},Ul=e=>{let t=e.customDataBuffer;return new Uint32Array(t.buffer,t.byteOffset,1)[0]},Wl=(e,t)=>{let n=[],r=[],i=[],a=Ul(e);if(t.antialias!==0)throw Error(`Only default value (0) for Antialias attribute is supported`);Ol(e.inputs,t,a,n,r,i),e.compute(Hl(e.inputs[0],t,a,n,r,i),{inputs:[0]})},Gl=e=>{let t=e.antialias,n=e.axes,r=e.coordinateTransformMode,i=e.cubicCoeffA,a=e.excludeOutside!==0,o=e.extrapolationValue,s=e.keepAspectRatioPolicy,c=e.mode,l=e.nearestMode===``?`simple`:e.nearestMode;return V({antialias:t,axes:n,coordinateTransformMode:r,cubicCoeffA:i,excludeOutside:a,extrapolationValue:o,keepAspectRatioPolicy:s,mode:c,nearestMode:l})}}),ql,Jl,Yl,Xl=d(()=>{L(),B(),Y(),ql=e=>{if(!e||e.length<3)throw Error(`layerNorm requires at least 3 inputs.`);let t=e[0],n=e[1],r=e[2];if(t.dataType!==n.dataType||t.dataType!==r.dataType)throw Error(`All inputs must have the same data type`);if(t.dims.length!==3&&t.dims.length!==2)throw Error(`Input must be 2D or 3D`);if(n.dims.length!==3&&n.dims.length!==2)throw Error(`Skip must be 2D or 3D`);let i=t.dims[t.dims.length-1],a=t.dims[t.dims.length-2];if(n.dims[n.dims.length-1]!==i)throw Error(`Skip must have the same hidden size as input`);if(n.dims[n.dims.length-2]!==a)throw Error(`Skip must have the same sequence length as input`);if(r.dims.length!==1)throw Error(`Gamma must be 1D`);if(r.dims[r.dims.length-1]!==i)throw Error(`Gamma must have the same hidden size as input`);if(e.length>3){let t=e[3];if(t.dims.length!==1)throw Error(`Beta must be 1D`);if(t.dims[t.dims.length-1]!==i)throw Error(`Beta must have the same hidden size as input`)}if(e.length>4){let t=e[4];if(t.dims.length!==1)throw Error(`Bias must be 1D`);if(t.dims[t.dims.length-1]!==i)throw Error(`Bias must have the same hidden size as input`)}},Jl=(e,t,n,r)=>{let i=t.simplified,a=e[0].dims,o=z.size(a),s=a,c=o,l=a.slice(-1)[0],u=r?a.slice(0,-1).concat(1):[],d=!i&&e.length>3,f=e.length>4,p=r&&n>1,m=r&&n>2,h=n>3,g=G(l),_=[{type:12,data:c},{type:12,data:g},{type:12,data:l},{type:1,data:t.epsilon}],v=t=>{let n=[{name:`output_size`,type:`u32`},{name:`components`,type:`u32`},{name:`hidden_size`,type:`u32`},{name:`epsilon`,type:`f32`}],r=[q(`x`,e[0].dataType,e[0].dims,g),q(`skip`,e[1].dataType,e[1].dims,g),q(`gamma`,e[2].dataType,e[2].dims,g)];d&&r.push(q(`beta`,e[3].dataType,e[3].dims,g)),f&&r.push(q(`bias`,e[4].dataType,e[4].dims,g)),r.push(J(`output`,e[0].dataType,s,g)),p&&r.push(J(`mean_output`,1,u)),m&&r.push(J(`inv_std_output`,1,u)),h&&r.push(J(`input_skip_bias_sum`,e[0].dataType,s,g));let a=U(e[0].dataType),o=U(1,g);return`

      ${t.registerUniforms(n).declareVariables(...r)}
      var<workgroup> sum_shared : array<${o}, 64>;
      var<workgroup> sum_squared_shared : array<${o}, 64>;

      ${t.mainStart([64,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / 64;

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / 64;
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == 63) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${f?`bias[offset1d + i]`:a+`(0.0)`};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${h?`input_skip_bias_sum[offset + i] = value;`:``}
          output[offset + i] = value;
          let f32_value = ${An(a,g,`value`)};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = 64;
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${jn(`sum`,g)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${jn(`square_sum`,g)} / f32(uniforms.hidden_size) ${i?``:`- mean * mean`} + uniforms.epsilon);
        ${p?`mean_output[global_idx] = mean;`:``}
        ${m?`inv_std_output[global_idx] = inv_std_dev;`:``}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${i?``:`- ${a}(mean)`}) *
            ${a}(inv_std_dev) * gamma[offset1d + i]
            ${d?`+ beta[offset1d + i]`:``};
        }
      }`},y=[{dims:s,dataType:e[0].dataType}];return n>1&&y.push({dims:u,dataType:1}),n>2&&y.push({dims:u,dataType:1}),n>3&&y.push({dims:a,dataType:e[0].dataType}),{name:`SkipLayerNormalization`,shaderCache:{hint:`${g};${p};${m};${h}`,inputDependencies:e.map((e,t)=>`type`)},getShaderSource:v,getRunData:()=>({outputs:y,dispatchGroup:{x:Math.ceil(c/l)},programUniforms:_})}},Yl=(e,t)=>{ql(e.inputs);let n=[0];e.outputCount>1&&n.push(-3),e.outputCount>2&&n.push(-3),e.outputCount>3&&n.push(3),e.compute(Jl(e.inputs,t,e.outputCount,!1),{outputs:n})}}),Zl,Ql,$l,eu,tu,nu,ru,iu,au=d(()=>{L(),B(),H(),Y(),Zl=(e,t)=>{if(!e||e.length<1)throw Error(`too few inputs`);if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw Error(`axes, starts and ends must have the same length`)}else if(t.starts.length!==t.ends.length)throw Error(`starts and ends must have the same length`);e.slice(1).forEach((t,n)=>{if(e[n+1].dataType!==6&&e[n+1].dataType!==7)throw Error(`Input ${n} must be an array of int32 or int64`)})},Ql=(e,t)=>{let n=[];if(e.length>t){if(e[t].dataType===7)e[t].getBigInt64Array().forEach(e=>n.push(Number(e)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(e=>n.push(Number(e)));else throw Error(`Input ${t} must be an array of int32 or int64`)}return n},$l=(e,t)=>{if(e.length>1){let t=Ql(e,1),n=Ql(e,2),r=Ql(e,3);return r.length===0&&(r=[...Array(e[0].dims.length).keys()]),V({starts:t,ends:n,axes:r})}return t},eu=(e,t,n,r,i)=>{let a=e;return e<0&&(a+=n[r[t]]),i[t]<0?Math.max(0,Math.min(a,n[r[t]]-1)):Math.max(0,Math.min(a,n[r[t]]))},tu=(e,t,n)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${n.length-1}; i >= 0; i--) {
            let input_shape_i = ${K(`uniforms.input_shape`,`i`,n.length)};
            let steps_i = ${K(`uniforms.steps`,`i`,n.length)};
            let signs_i = ${K(`uniforms.signs`,`i`,n.length)};
            let starts_i = ${K(`uniforms.starts`,`i`,n.length)};
            var output_index = ${t.indicesGet(`output_indices`,`i`)};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${e.indicesSet(`input_indices`,`i`,`input_index`)};
          }
          return input_indices;
      }`,nu=(e,t)=>{let n=e[0].dims,r=z.size(n),i=t.axes.length>0?z.normalizeAxes(t.axes,n.length):[...Array(n.length).keys()],a=Ql(e,4);a.forEach(e=>e!==0||(()=>{throw Error(`step cannot be 0`)})),a.length===0&&(a=Array(i.length).fill(1));let o=t.starts.map((e,t)=>eu(e,t,n,i,a)),s=t.ends.map((e,t)=>eu(e,t,n,i,a));if(i.length!==o.length||i.length!==s.length)throw Error(`start, ends and axes should have the same number of elements`);if(i.length!==n.length)for(let e=0;e<n.length;++e)i.includes(e)||(o.splice(e,0,0),s.splice(e,0,n[e]),a.splice(e,0,1));let c=a.map(e=>Math.sign(e));a.forEach((e,t,n)=>{if(e<0){let r=(s[t]-o[t])/e,i=o[t],c=i+r*a[t];o[t]=c,s[t]=i,n[t]=-e}});let l=n.slice(0);i.forEach((e,t)=>{l[e]=Math.ceil((s[e]-o[e])/a[e])});let u={dims:l,dataType:e[0].dataType},d=J(`output`,e[0].dataType,l.length),f=q(`input`,e[0].dataType,e[0].dims.length),p=z.size(l),m=[{name:`outputSize`,type:`u32`},{name:`starts`,type:`u32`,length:o.length},{name:`signs`,type:`i32`,length:c.length},{name:`steps`,type:`u32`,length:a.length}],h=[{type:12,data:p},{type:12,data:o},{type:6,data:c},{type:12,data:a},...W(e[0].dims,l)];return{name:`Slice`,shaderCache:{hint:`${c.length}_${o.length}_${a.length}`,inputDependencies:[`rank`]},getShaderSource:e=>`
      ${e.registerUniforms(m).declareVariables(f,d)}
        ${tu(f,d,n)}
        ${e.mainStart()}
          ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}
          let output_indices = ${d.offsetToIndices(`global_idx`)};
          let input_indices = calculateInputIndices(output_indices);
          ${d.setByOffset(`global_idx`,f.getByIndices(`input_indices`))}
      }`,getRunData:()=>({outputs:[u],dispatchGroup:{x:Math.ceil(r/64)},programUniforms:h})}},ru=(e,t)=>{Zl(e.inputs,t);let n=$l(e.inputs,t);e.compute(nu(e.inputs,n),{inputs:[0]})},iu=e=>{let t=e.starts,n=e.ends,r=e.axes;return V({starts:t,ends:n,axes:r})}}),ou,su,cu,lu,uu=d(()=>{L(),B(),H(),Kn(),Y(),ou=e=>{if(!e||e.length!==1)throw Error(`Softmax op requires 1 input.`)},su=(e,t)=>{let n=e.inputs[0],r=n.dims,i=z.size(r),a=r.length,o=z.normalizeAxis(t.axis,a),s=o<r.length-1,c,l=[];s?(l=Array.from({length:a},(e,t)=>t),l[o]=a-1,l[a-1]=o,c=e.compute(Un(n,l),{inputs:[n],outputs:[-1]})[0]):c=n;let u=c.dims,d=u[a-1],f=i/d,p=G(d),m=d/p,h=64;f===1&&(h=256);let g=(e,t)=>t===4?`max(max(${e}.x, ${e}.y), max(${e}.z, ${e}.w))`:t===2?`max(${e}.x, ${e}.y)`:t===3?`max(max(${e}.x, ${e}.y), ${e}.z)`:e,_=q(`x`,c.dataType,c.dims,p),v=J(`result`,c.dataType,c.dims,p),y=_.type.value,b=U(c.dataType)===`f32`?`var threadMax = ${y}(-3.4028234663852886e+38f);`:`var threadMax = ${y}(-65504.0h);`,x=e.compute({name:`Softmax`,shaderCache:{hint:`${p};${h}`,inputDependencies:[`type`]},getRunData:()=>({outputs:[{dims:u,dataType:c.dataType}],dispatchGroup:{x:f},programUniforms:[{type:6,data:m}]}),getShaderSource:e=>`
      var<workgroup> rowMaxShared : ${y};
      var<workgroup> rowSumShared : ${y};
      var<workgroup> threadShared : array<${y}, ${h}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${y} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${y}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${e.registerUniform(`packedCols`,`i32`).declareVariables(_,v)}
      ${e.mainStart(h)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${h};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${b}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${y}(${g(`threadShared[0]`,p)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${y}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${y}(${jn(`threadShared[0]`,p)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          var value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          // max operation protects against NaN since all values should be >=0
          value = max(value, ${y}(0.0));
          setValue(row, col, row_stride, value);
        }
      }`},{inputs:[c],outputs:[s?-1:0]})[0];s&&e.compute(Un(x,l),{inputs:[x]})},cu=(e,t)=>{ou(e.inputs),su(e,t)},lu=e=>V({axis:e.axis})}),du,fu,pu,mu,hu,gu=d(()=>{L(),B(),Y(),du=e=>Array.from(e.getBigInt64Array(),Number),fu=e=>{if(!e||e.length!==2)throw Error(`Tile requires 2 inputs.`);if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw Error(`Tile only support float, float16, int32, and uint32 data types`);if(e[1].dataType!==7)throw Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw Error("Tile `repeats` input should be 1-D");if(du(e[1]).length!==e[0].dims.length)throw Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},pu=(e,t)=>{let n=[];for(let r=0;r<e.length;++r)n.push(e[r]*t[r]);return n},mu=(e,t)=>{let n=e[0].dims,r=t??du(e[1]),i=pu(n,r),a=z.size(i),o=e[0].dataType,s=q(`input`,o,n.length),c=J(`output`,o,i.length);return{name:`Tile`,shaderCache:{hint:`${r}`,inputDependencies:[`rank`]},getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:[{type:12,data:a},...W(e[0].dims,i)]}),getShaderSource:e=>`
      const inputShape = ${s.indices(...n)};
      ${e.registerUniform(`output_size`,`u32`).declareVariables(s,c)}
      ${e.mainStart()}
      ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
      let output_indices = ${c.offsetToIndices(`global_idx`)};
      var input_indices: ${s.type.indices};
      for (var i = 0; i < ${n.length}; i++) {
        let input_dim_i = ${s.indicesGet(`uniforms.input_shape`,`i`)};
        let input_dim_value = ${c.indicesGet(`output_indices`,`i`)}  % input_dim_i;

        ${s.indicesSet(`input_indices`,`i`,`input_dim_value`)}
      }
      ${c.setByOffset(`global_idx`,s.getByIndices(`input_indices`))}
    }`}},hu=e=>{fu(e.inputs),e.compute(mu(e.inputs),{inputs:[0]})}}),_u,vu,yu,bu=d(()=>{L(),B(),Y(),_u=(e,t,n,r,i)=>{let a=J(`output_data`,i,n.length,4),o=q(`a_data`,t[1].dataType,t[1].dims.length,4),s=q(`b_data`,t[2].dataType,t[2].dims.length,4),c=q(`c_data`,t[0].dataType,t[0].dims.length,4),l,u=(e,t,n)=>`select(${t}, ${e}, ${n})`;if(!r)l=a.setByOffset(`global_idx`,u(o.getByOffset(`global_idx`),s.getByOffset(`global_idx`),c.getByOffset(`global_idx`)));else{let e=(e,t,n=``)=>{let r=`a_data[index_a${t}][component_a${t}]`,i=`b_data[index_b${t}][component_b${t}]`,l=`bool(c_data[index_c${t}] & (0xffu << (component_c${t} * 8)))`;return`
            let output_indices${t} = ${a.offsetToIndices(`global_idx * 4u + ${t}u`)};
            let offset_a${t} = ${o.broadcastedIndicesToOffset(`output_indices${t}`,a)};
            let offset_b${t} = ${s.broadcastedIndicesToOffset(`output_indices${t}`,a)};
            let offset_c${t} = ${c.broadcastedIndicesToOffset(`output_indices${t}`,a)};
            let index_a${t} = offset_a${t} / 4u;
            let index_b${t} = offset_b${t} / 4u;
            let index_c${t} = offset_c${t} / 4u;
            let component_a${t} = offset_a${t} % 4u;
            let component_b${t} = offset_b${t} % 4u;
            let component_c${t} = offset_c${t} % 4u;
            ${e}[${t}] = ${n}(${u(r,i,l)});
          `};l=i===9?`
            var data = vec4<u32>(0);
            ${e(`data`,0,`u32`)}
            ${e(`data`,1,`u32`)}
            ${e(`data`,2,`u32`)}
            ${e(`data`,3,`u32`)}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:`
            ${e(`output_data[global_idx]`,0)}
            ${e(`output_data[global_idx]`,1)}
            ${e(`output_data[global_idx]`,2)}
            ${e(`output_data[global_idx]`,3)}
          `}return`
        ${e.registerUniform(`vec_size`,`u32`).declareVariables(c,o,s,a)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.vec_size`)}
        ${l}
      }`},vu=e=>{let t=e[1].dims,n=e[2].dims,r=e[0].dims,i=e[1].dataType,a=!(z.areEqual(t,n)&&z.areEqual(n,r)),o=t,s=z.size(t);if(a){let e=Wt.calcShape(Wt.calcShape(t,n,!1),r,!1);if(!e)throw Error(`Can't perform where op on the given tensors`);o=e,s=z.size(o)}let c=Math.ceil(s/4);return{name:`Where`,shaderCache:{inputDependencies:[`rank`,`rank`,`rank`]},getShaderSource:t=>_u(t,e,o,a,i),getRunData:()=>({outputs:[{dims:o,dataType:i}],dispatchGroup:{x:Math.ceil(s/64/4)},programUniforms:[{type:12,data:c},...W(r,t,n,o)]})}},yu=e=>{e.compute(vu(e.inputs))}}),xu,Su=d(()=>{Ur(),Qr(),ri(),si(),na(),ga(),Ca(),_o(),ko(),No(),zo(),Zo(),rs(),os(),ds(),hs(),bs(),Ts(),As(),Gs(),_c(),Sc(),Ec(),kc(),Fc(),$s(),Gc(),dl(),gl(),bl(),Tl(),Rr(),Kl(),dc(),Xl(),au(),uu(),sc(),gu(),Kn(),Qi(),bu(),xu=new Map([[`Abs`,[li]],[`Acos`,[ui]],[`Acosh`,[di]],[`Add`,[oa]],[`ArgMax`,[Vr,Hr]],[`ArgMin`,[Br,Hr]],[`Asin`,[fi]],[`Asinh`,[pi]],[`Atan`,[mi]],[`Atanh`,[hi]],[`Attention`,[Zr]],[`AveragePool`,[nl,tl]],[`BatchNormalization`,[ni]],[`BiasAdd`,[oi]],[`BiasSplitGelu`,[ta]],[`Cast`,[_i,gi]],[`Ceil`,[bi]],[`Clip`,[yi]],[`Concat`,[xa,Sa]],[`Conv`,[go,fo]],[`ConvTranspose`,[Oo,wo]],[`Cos`,[xi]],[`Cosh`,[Si]],[`CumSum`,[jo,Mo]],[`DepthToSpace`,[Lo,Ro]],[`DequantizeLinear`,[ml,hl]],[`Div`,[sa]],[`Einsum`,[Yo,Xo]],[`Elu`,[wi,Ci]],[`Equal`,[ca]],[`Erf`,[Ei]],[`Exp`,[Di]],[`Expand`,[ns]],[`FastGelu`,[as]],[`Floor`,[Oi]],[`FusedConv`,[go,fo]],[`Gather`,[us,ls]],[`GatherElements`,[ws,Cs]],[`GatherBlockQuantized`,[vs,ys]],[`GatherND`,[ps,ms]],[`Gelu`,[ki]],[`Gemm`,[ks,Os]],[`GlobalAveragePool`,[al,il]],[`GlobalMaxPool`,[ul,ll]],[`Greater`,[fa]],[`GreaterOrEqual`,[ma]],[`GridSample`,[Us,Ws]],[`GroupQueryAttention`,[gc]],[`HardSigmoid`,[Li,Ii]],[`InstanceNormalization`,[xc]],[`LayerNormalization`,[Tc]],[`LeakyRelu`,[Ai,Ci]],[`Less`,[pa]],[`LessOrEqual`,[ha]],[`Log`,[Ji]],[`MatMul`,[Oc]],[`MatMulNBits`,[Nc,Pc]],[`MaxPool`,[sl,cl]],[`Mul`,[la]],[`MultiHeadAttention`,[Qs,Js]],[`Neg`,[Mi]],[`Not`,[ji]],[`Pad`,[Wc]],[`Pow`,[ua]],[`QuickGelu`,[Zi,Ci]],[`Range`,[yl]],[`Reciprocal`,[Ni]],[`ReduceMin`,[Nr]],[`ReduceMean`,[Or]],[`ReduceMax`,[Mr]],[`ReduceSum`,[Fr]],[`ReduceProd`,[Pr]],[`ReduceL1`,[kr]],[`ReduceL2`,[Ar]],[`ReduceLogSum`,[Lr]],[`ReduceLogSumExp`,[jr]],[`ReduceSumSquare`,[Ir]],[`Relu`,[Pi]],[`Resize`,[Wl,Gl]],[`RotaryEmbedding`,[uc]],[`ScatterND`,[wl,Cl]],[`Sigmoid`,[Fi]],[`Sin`,[Ri]],[`Sinh`,[zi]],[`Slice`,[ru,iu]],[`SkipLayerNormalization`,[Yl]],[`Split`,[ac,oc]],[`Sqrt`,[Bi]],[`Softmax`,[cu,lu]],[`Sub`,[da]],[`Tan`,[Vi]],[`Tanh`,[Ui]],[`ThresholdedRelu`,[qi,Ci]],[`Tile`,[hu]],[`Transpose`,[Wn,Gn]],[`Where`,[yu]]])}),Cu,wu=d(()=>{Ne(),Ht(),Y(),Cu=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,n,r,i){be(e.programInfo.name);let a=this.backend.device,o=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let s=[];for(let e of t)s.push({binding:s.length,resource:{buffer:e.buffer}});for(let e of n)s.push({binding:s.length,resource:{buffer:e.buffer}});i&&s.push({binding:s.length,resource:i});let c=a.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:s,label:e.programInfo.name});if(this.backend.sessionStatus===`capturing`){let t={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:c,dispatchGroup:r};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(t)}o.setPipeline(e.computePipeline),o.setBindGroup(0,c),o.dispatchWorkgroups(...r),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType===`at-passes`)&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),N(e.programInfo.name)}dispose(){}build(e,t){be(e.name);let n=this.backend.device,r=[];[{feature:`shader-f16`,extension:`f16`},{feature:`subgroups`,extension:`subgroups`}].forEach(e=>{n.features.has(e.feature)&&r.push(`enable ${e.extension};`)});let i=In(t,this.backend.device.limits),a=e.getShaderSource(i),o=`${r.join(`
`)}
${i.additionalImplementations}
${a}`,s=n.createShaderModule({code:o,label:e.name});R(`verbose`,()=>`[WebGPU] ${e.name} shader code: ${o}`);let c=n.createComputePipeline({compute:{module:s,entryPoint:`main`},layout:`auto`,label:e.name});return N(e.name),{programInfo:e,computePipeline:c,uniformVariablesInfo:i.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e==`number`?e:e.x,n=typeof e==`number`?1:e.y||1,r=typeof e==`number`?1:e.z||1,i=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=i&&n<=i&&r<=i)return[t,n,r];let a=t*n*r,o=Math.ceil(Math.sqrt(a));if(o>i){if(o=Math.ceil(Math.cbrt(a)),o>i)throw Error(`Total dispatch size exceeds WebGPU maximum.`);return[o,o,o]}return[o,o,1]}}}),Tu={};f(Tu,{WebGpuBackend:()=>ku});var Eu,Du,Ou,ku,Au=d(()=>{Ne(),L(),Ht(),Xt(),wn(),Su(),wu(),Eu=(e,t)=>{if(t.length!==e.length)throw Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let n=[];for(let r=0;r<e.length;++r){let i=e[r].dataType;switch(t[r]){case`none`:n.push(``);break;case`type`:n.push(`${i}`);break;case`rank`:{let t=e[r].dims.length;n.push(`${i};${t}`);break}case`dims`:{let t=e[r].dims.join(`,`);n.push(`${i};${t}`);break}default:throw Error(`unsupported input dependency: ${t[r]}`)}}return n.join(`|`)},Du=(e,t,n)=>{let r=e.name;return e.shaderCache?.hint&&(r+=`[`+e.shaderCache.hint+`]`),r+=`:`+n+`:${Eu(t,e.shaderCache?.inputDependencies??Array(t.length).fill(`dims`))}`,r},Ou=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},ku=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus=`default`,this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw Error(`currentKernelCustomData(): currentKernelId is null. (should not happen)`);let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let n=[],r={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:n},i=e=>t.features.has(e)&&n.push(e)&&!0;i(`chromium-experimental-timestamp-query-inside-passes`)||i(`timestamp-query`),i(`shader-f16`),i(`subgroups`),this.device=await t.requestDevice(r);let a=t,o=t.info??(typeof a.requestAdapterInfo==`function`?await a.requestAdapterInfo():void 0);this.adapterInfo=new Ou(o),this.gpuDataManager=Cn(this),this.programManager=new Cu(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,Bt(e.logLevel,!!e.debug),this.device.onuncapturederror=e=>{e.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${e.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!0}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<`u`&&this.querySet.destroy(),this.gpuDataManager.dispose(),this.device&&this.env?.webgpu&&this.device.lost.then(()=>{delete this.env.webgpu.device})}getCommandEncoder(){return this.commandEncoder||=this.device.createCommandEncoder(),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType===`at-passes`&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&=(this.computePassEncoder.end(),null)}flush(){if(!this.commandEncoder)return;be(),this.endComputePass();let e;this.queryType!==`none`&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!==`none`&&e.mapAsync(GPUMapMode.READ).then(()=>{let t=new BigUint64Array(e.getMappedRange()),n=this.pendingQueries.get(e);for(let e=0;e<t.length/2;e++){let r=n[e],i=r.kernelId,a=this.kernels.get(i),o=a.kernelType,s=a.kernelName,c=r.programName,l=r.inputTensorViews,u=r.outputTensorViews,d=t[e*2],f=t[e*2+1];typeof this.queryTimeBase>`u`&&(this.queryTimeBase=d);let p=Number(d-this.queryTimeBase),m=Number(f-this.queryTimeBase);if(!Number.isSafeInteger(p)||!Number.isSafeInteger(m))throw RangeError(`incorrect timestamp range`);if(this.env.webgpu.profiling?.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:l.map(e=>({dims:e.dims,dataType:Dt(e.dataType)})),outputsMetadata:u.map(e=>({dims:e.dims,dataType:Dt(e.dataType)})),kernelId:i,kernelType:o,kernelName:s,programName:c,startTime:p,endTime:m});else{let e=``;l.forEach((t,n)=>{e+=`input[${n}]: [${t.dims}] | ${Dt(t.dataType)}, `});let t=``;u.forEach((e,n)=>{t+=`output[${n}]: [${e.dims}] | ${Dt(e.dataType)}, `}),console.log(`[profiling] kernel "${i}|${o}|${s}|${c}" ${e}${t}start time: ${p} ns, execution time: ${m-p} ns`)}ve(`GPU`,`${c}::${d}::${f}`)}e.unmap(),this.pendingQueries.delete(e)}),N()}run(e,t,n,r,i,a){be(e.name);let o=[];for(let e=0;e<t.length;++e){let n=t[e].data;if(n===0)continue;let r=this.gpuDataManager.get(n);if(!r)throw Error(`no GPU data for input: ${n}`);o.push(r)}let{outputs:s,dispatchGroup:c,programUniforms:l}=e.getRunData(t),u=n.length===0?s.map((e,t)=>t):n;if(u.length!==s.length)throw Error(`Output size ${u.length} must be equal to ${s.length}.`);let d=[],f=[];for(let e=0;e<s.length;++e){if(!Number.isInteger(u[e])||u[e]<-3||u[e]>=a)throw Error(`Invalid output index: ${u[e]}`);if(u[e]===-3)continue;let t=u[e]===-1,n=u[e]===-2,o=t||n?i(s[e].dataType,s[e].dims):r(u[e],s[e].dataType,s[e].dims);if(d.push(o),o.data===0)continue;let c=this.gpuDataManager.get(o.data);if(!c)throw Error(`no GPU data for output: ${o.data}`);if(t&&this.temporaryData.push(c),n){let e=this.kernelPersistentData.get(this.currentKernelId);e||(e=[],this.kernelPersistentData.set(this.currentKernelId,e)),e.push(c)}f.push(c)}if(o.length!==t.length||f.length!==d.length){if(f.length===0)return N(e.name),d;throw Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let p;if(l){let e=0,t=[];l.forEach(n=>{let r=typeof n.data==`number`?[n.data]:n.data;if(r.length===0)return;let i=n.type===10?2:4,a,o;n.type===10?(o=r.length>4?16:r.length>2?8:r.length*i,a=r.length>4?16:i*r.length):(o=r.length<=2?r.length*i:16,a=16),e=Math.ceil(e/o)*o,t.push(e);let s=n.type===10?8:4;e+=r.length>4?Math.ceil(r.length/s)*a:r.length*i}),e=Math.ceil(e/16)*16;let n=new ArrayBuffer(e);l.forEach((e,r)=>{let i=t[r],a=typeof e.data==`number`?[e.data]:e.data;if(e.type===6)new Int32Array(n,i,a.length).set(a);else if(e.type===12)new Uint32Array(n,i,a.length).set(a);else if(e.type===10)new Uint16Array(n,i,a.length).set(a);else if(e.type===1)new Float32Array(n,i,a.length).set(a);else throw Error(`Unsupported uniform type: ${Dt(e.type)}`)});let r=this.gpuDataManager.create(e,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(r.buffer,0,n,0,e),this.gpuDataManager.release(r.id),p={offset:0,size:e,buffer:r.buffer}}let m=this.programManager.normalizeDispatchGroupSize(c),h=m[1]===1&&m[2]===1,g=Du(e,t,h),_=this.programManager.getArtifact(g);if(_||(_=this.programManager.build(e,m),this.programManager.setArtifact(g,_),R(`info`,()=>`[artifact] key: ${g}, programName: ${e.name}`)),l&&_.uniformVariablesInfo){if(l.length!==_.uniformVariablesInfo.length)throw Error(`Uniform variables count mismatch: expect ${_.uniformVariablesInfo.length}, got ${l.length} in program "${_.programInfo.name}".`);for(let e=0;e<l.length;e++){let t=l[e],n=t.type,r=typeof t.data==`number`?1:t.data.length,[i,a]=_.uniformVariablesInfo[e];if(n!==i||r!==a)throw Error(`Uniform variable ${e} mismatch: expect type ${i} with size ${a}, got type ${n} with size ${r} in program "${_.programInfo.name}".`)}}if(R(`info`,()=>`[ProgramManager] run "${e.name}" (key=${g}) with ${m[0]}x${m[1]}x${m[2]}`),this.queryType!==`none`||this.sessionStatus===`capturing`){let e={kernelId:this.currentKernelId,programName:_.programInfo.name,inputTensorViews:t,outputTensorViews:d};this.pendingKernels.push(e),this.sessionStatus===`capturing`&&this.capturedPendingKernels.get(this.currentSessionId).push(e)}return this.programManager.run(_,o,f,m,p),N(e.name),d}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,n,r){let i=xu.get(e);if(!i)throw Error(`kernel not implemented: ${e}`);let a={kernelType:e,kernelName:r,kernelEntry:i[0],attributes:[i[1],n]};this.kernels.set(t,a)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let e of t)this.gpuDataManager.release(e.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,n){let r=this.kernels.get(e);if(!r)throw Error(`kernel not created: ${e}`);let i=r.kernelType,a=r.kernelName,o=r.kernelEntry,s=r.attributes;if(this.currentKernelId!==null)throw Error(`kernel "[${i}] ${a}" is not allowed to be called recursively`);this.currentKernelId=e,s[0]&&=(s[1]=s[0](s[1]),void 0),R(`info`,()=>`[WebGPU] Start to run kernel "[${i}] ${a}"...`);let c=this.env.debug;this.temporaryData=[];try{return c&&this.device.pushErrorScope(`validation`),o(t,s[1]),0}catch(e){return n.push(Promise.resolve(`[WebGPU] Kernel "[${i}] ${a}" failed. ${e}`)),1}finally{c&&n.push(this.device.popErrorScope().then(e=>e?`GPU validation error for kernel "[${i}] ${a}": ${e.message}`:null));for(let e of this.temporaryData)this.gpuDataManager.release(e.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,n,r){let i=this.sessionExternalDataMapping.get(e);i||(i=new Map,this.sessionExternalDataMapping.set(e,i));let a=i.get(t),o=this.gpuDataManager.registerExternalBuffer(n,r,a);return i.set(t,[o,n]),o}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(e=>this.gpuDataManager.unregisterExternalBuffer(e[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,n){return async()=>{let r=await xn(this,e,t);return Yt(r.buffer,n)}}writeTimestamp(e){this.queryType===`inside-passes`&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){this.queryType=`none`,(this.env.webgpu.profiling?.mode==="default"||(typeof this.env.trace>`u`?this.env.wasm.trace:this.env.trace))&&(this.device.features.has(`chromium-experimental-timestamp-query-inside-passes`)?this.queryType=`inside-passes`:this.device.features.has(`timestamp-query`)&&(this.queryType=`at-passes`),this.queryType!==`none`&&typeof this.querySet>`u`&&(this.querySet=this.device.createQuerySet({type:`timestamp`,count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){R(`info`,`captureBegin`),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus=`capturing`}captureEnd(){R(`info`,`captureEnd`),this.flush(),this.sessionStatus=`default`}replay(){R(`info`,`replay`),this.sessionStatus=`replaying`;let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),n=e.length;this.pendingKernels=[];for(let r=0;r<n;r++){let n=this.getComputePassEncoder(),i=e[r];this.writeTimestamp(this.pendingDispatchNumber*2),n.setPipeline(i.computePipeline),n.setBindGroup(0,i.bindGroup),n.dispatchWorkgroups(...i.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!==`none`&&this.pendingKernels.push(t[r]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType===`at-passes`)&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus=`default`}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),ju={};f(ju,{init:()=>Pu});var Mu,Nu,Pu,Fu=d(()=>{L(),Ht(),B(),pn(),Mu=class e{constructor(e,t,n,r){this.module=e,this.dataType=t,this.data=n,this.dims=r}getFloat32Array(){if(this.dataType!==1)throw Error(`Invalid data type`);let e=z.size(this.dims);return e===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,e)}getBigInt64Array(){if(this.dataType!==7)throw Error(`Invalid data type`);let e=z.size(this.dims);return e===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,e)}getInt32Array(){if(this.dataType!==6)throw Error(`Invalid data type`);let e=z.size(this.dims);return e===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,e)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw Error(`Invalid data type`);let e=z.size(this.dims);return e===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,e)}reshape(t){if(z.size(t)!==z.size(this.dims))throw Error(`Invalid new shape`);return new e(this.module,this.dataType,this.data,t)}},Nu=class{constructor(e,t,n){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo;let r=e.PTR_SIZE,i=n/e.PTR_SIZE,a=r===4?`i32`:`i64`;this.opKernelContext=Number(e.getValue(r*i++,a));let o=Number(e.getValue(r*i++,a));this.outputCount=Number(e.getValue(r*i++,a)),this.customDataOffset=Number(e.getValue(r*i++,`*`)),this.customDataSize=Number(e.getValue(r*i++,a));let s=[];for(let t=0;t<o;t++){let t=Number(e.getValue(r*i++,a)),n=Number(e.getValue(r*i++,`*`)),o=Number(e.getValue(r*i++,a)),c=[];for(let t=0;t<o;t++)c.push(Number(e.getValue(r*i++,a)));s.push(new Mu(e,t,n,c))}this.inputs=s}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){let n=t?.inputs?.map(e=>typeof e==`number`?this.inputs[e]:e)??this.inputs,r=t?.outputs??[];return this.backend.run(e,n,r,(e,t,n)=>new Mu(this.module,t,this.output(e,n),n),(e,t)=>{let n=Ot(e,t);if(!n)throw Error(`Unsupported data type: ${e}`);let r=n>0?this.backend.gpuDataManager.create(n).id:0;return new Mu(this.module,e,r,t)},this.outputCount)}output(e,t){let n=this.module.stackSave();try{let n=this.module.PTR_SIZE,r=n===4?`i32`:`i64`,i=this.module.stackAlloc((1+t.length)*n);this.module.setValue(i,t.length,r);for(let e=0;e<t.length;e++)this.module.setValue(i+n*(e+1),t[e],r);return this.module._JsepOutput(this.opKernelContext,e,i)}catch(n){throw Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${n}`)}finally{this.module.stackRestore(n)}}},Pu=async(e,t,n,r)=>{let i=t.jsepInit;if(!i)throw Error(`Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.`);if(e===`webgpu`){let e=(Au(),m(Tu)).WebGpuBackend,a=new e;await a.initialize(n,r),i(`webgpu`,[a,e=>a.alloc(Number(e)),e=>a.free(e),(e,n,r,i=!1)=>{if(i)R(`verbose`,()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(e)}, dst=${Number(n)}, size=${Number(r)}`),a.memcpy(Number(e),Number(n));else{R(`verbose`,()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(e)}, gpuDataId=${Number(n)}, size=${Number(r)}`);let i=t.HEAPU8.subarray(Number(e>>>0),Number(e>>>0)+Number(r));a.upload(Number(n),i)}},async(e,n,r)=>{R(`verbose`,()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${e}, dataOffset=${n}, size=${r}`),await a.download(Number(e),()=>t.HEAPU8.subarray(Number(n)>>>0,Number(n+r)>>>0))},(e,n,r)=>a.createKernel(e,Number(n),r,t.UTF8ToString(t._JsepGetNodeName(Number(n)))),e=>a.releaseKernel(e),(e,n,r,i)=>{R(`verbose`,()=>`[WebGPU] jsepRun: sessionHandle=${r}, kernel=${e}, contextDataOffset=${n}`);let o=new Nu(t,a,Number(n));return a.computeKernel(Number(e),o,i)},()=>a.captureBegin(),()=>a.captureEnd(),()=>a.replay()])}else{let e=new fn(n);i(`webnn`,[e,()=>e.reserveTensorId(),t=>e.releaseTensorId(t),async(t,n,r,i,a)=>e.ensureTensor(t,n,r,i,a),(t,n)=>{e.uploadTensor(t,n)},async(t,n)=>e.downloadTensor(t,n),(t,n)=>e.registerMLContext(t,n),!!n.trace])}}}),Iu,Lu,Ru,zu,Bu,Vu,Hu,Uu,Wu,Gu,Ku,qu,Ju,Yu=d(()=>{Ne(),vt(),Tt(),L(),pt(),gt(),Ft(),Iu=(e,t)=>{F()._OrtInit(e,t)!==0&&I(`Can't initialize onnxruntime.`)},Lu=async e=>{Iu(e.wasm.numThreads,At(e.logLevel))},Ru=async(e,t)=>{F().asyncInit?.();let n=e.webgpu.adapter;if(t===`webgpu`){if(typeof navigator>`u`||!navigator.gpu)throw Error(`WebGPU is not supported in current environment`);if(n){if(typeof n.limits!=`object`||typeof n.features!=`object`||typeof n.requestDevice!=`function`)throw Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let t=e.webgpu.powerPreference;if(t!==void 0&&t!==`low-power`&&t!==`high-performance`)throw Error(`Invalid powerPreference setting: "${t}"`);let r=e.webgpu.forceFallbackAdapter;if(r!==void 0&&typeof r!=`boolean`)throw Error(`Invalid forceFallbackAdapter setting: "${r}"`);if(n=await navigator.gpu.requestAdapter({powerPreference:t,forceFallbackAdapter:r}),!n)throw Error(`Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.`)}}if(t===`webnn`&&(typeof navigator>`u`||!navigator.ml))throw Error(`WebNN is not supported in current environment`);{let r=(Fu(),m(ju)).init;t===`webgpu`&&await r(`webgpu`,F(),e,n),t===`webnn`&&await r(`webnn`,F(),e)}},zu=new Map,Bu=e=>{let t=F(),n=t.stackSave();try{let n=t.PTR_SIZE,r=t.stackAlloc(2*n);t._OrtGetInputOutputCount(e,r,r+n)!==0&&I(`Can't get session input/output count.`);let i=n===4?`i32`:`i64`;return[Number(t.getValue(r,i)),Number(t.getValue(r+n,i))]}finally{t.stackRestore(n)}},Vu=(e,t)=>{let n=F(),r=n.stackSave(),i=0;try{let r=n.PTR_SIZE,a=n.stackAlloc(2*r);n._OrtGetInputOutputMetadata(e,t,a,a+r)!==0&&I(`Can't get session input/output metadata.`);let o=Number(n.getValue(a,`*`));i=Number(n.getValue(a+r,`*`));let s=n.HEAP32[i/4];if(s===0)return[o,0];let c=n.HEAPU32[i/4+1],l=[];for(let e=0;e<c;e++){let t=Number(n.getValue(i+8+e*r,`*`));l.push(t===0?Number(n.getValue(i+8+(e+c)*r,`*`)):n.UTF8ToString(t))}return[o,s,l]}finally{n.stackRestore(r),i!==0&&n._OrtFree(i)}},Hu=e=>{let t=F(),n=t._malloc(e.byteLength);if(n===0)throw Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,n),[n,e.byteLength]},Uu=async(e,t)=>{let n,r,i=F();Array.isArray(e)?[n,r]=e:e.buffer===i.HEAPU8.buffer?[n,r]=[e.byteOffset,e.byteLength]:[n,r]=Hu(e);let a=0,o=0,s=0,c=[],l=[],u=[];try{if([o,c]=await wt(t),t?.externalData&&i.mountExternalData){let e=[];for(let n of t.externalData){let t=typeof n==`string`?n:n.path;e.push(Pt(typeof n==`string`?n:n.data).then(e=>{i.mountExternalData(t,e)}))}await Promise.all(e)}for(let e of t?.executionProviders??[])if((typeof e==`string`?e:e.name)===`webnn`){if(i.shouldTransferToMLTensor=!1,typeof e!=`string`){let t=e,n=t?.context,r=t?.gpuDevice,a=t?.deviceType,o=t?.powerPreference;i.currentContext=n||(r?await i.webnnCreateMLContext(r):await i.webnnCreateMLContext({deviceType:a,powerPreference:o}))}else i.currentContext=await i.webnnCreateMLContext();break}a=await i._OrtCreateSession(n,r,o),i.webgpuOnCreateSession?.(a),a===0&&I(`Can't create a session.`),i.jsepOnCreateSession?.(),i.currentContext&&(i.webnnRegisterMLContext(a,i.currentContext),i.currentContext=void 0,i.shouldTransferToMLTensor=!0);let[e,d]=Bu(a),f=!!t?.enableGraphCapture,p=[],m=[],h=[],g=[],_=[];for(let t=0;t<e;t++){let[e,n,r]=Vu(a,t);e===0&&I(`Can't get an input name.`),l.push(e);let o=i.UTF8ToString(e);p.push(o),h.push(n===0?{name:o,isTensor:!1}:{name:o,isTensor:!0,type:Dt(n),shape:r})}for(let n=0;n<d;n++){let[r,o,s]=Vu(a,n+e);r===0&&I(`Can't get an output name.`),u.push(r);let c=i.UTF8ToString(r);m.push(c),g.push(o===0?{name:c,isTensor:!1}:{name:c,isTensor:!0,type:Dt(o),shape:s});{if(f&&t?.preferredOutputLocation===void 0){_.push(`gpu-buffer`);continue}let e=typeof t?.preferredOutputLocation==`string`?t.preferredOutputLocation:t?.preferredOutputLocation?.[c]??`cpu`,n=i.webnnIsGraphOutput;if(e===`cpu`&&n&&n(a,c)){_.push(`ml-tensor-cpu-output`);continue}if(e!==`cpu`&&e!==`cpu-pinned`&&e!==`gpu-buffer`&&e!==`ml-tensor`)throw Error(`Not supported preferred output location: ${e}.`);if(f&&e!==`gpu-buffer`)throw Error(`Not supported preferred output location: ${e}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);_.push(e)}}let v=null;return _.some(e=>e===`gpu-buffer`||e===`ml-tensor`||e===`ml-tensor-cpu-output`)&&(s=i._OrtCreateBinding(a),s===0&&I(`Can't create IO binding.`),v={handle:s,outputPreferredLocations:_,outputPreferredLocationsEncoded:_.map(e=>e===`ml-tensor-cpu-output`?`ml-tensor`:e).map(e=>Nt(e))}),zu.set(a,[a,l,u,v,f,!1]),[a,p,m,h,g]}catch(e){throw l.forEach(e=>i._OrtFree(e)),u.forEach(e=>i._OrtFree(e)),s!==0&&i._OrtReleaseBinding(s)!==0&&I(`Can't release IO binding.`),a!==0&&i._OrtReleaseSession(a)!==0&&I(`Can't release session.`),e}finally{i._free(n),o!==0&&i._OrtReleaseSessionOptions(o)!==0&&I(`Can't release session options.`),c.forEach(e=>i._free(e)),i.unmountExternalData?.()}},Wu=e=>{let t=F(),n=zu.get(e);if(!n)throw Error(`cannot release session. invalid session id: ${e}`);let[r,i,a,o,s]=n;o&&(s&&t._OrtClearBoundOutputs(o.handle)!==0&&I(`Can't clear bound outputs.`),t._OrtReleaseBinding(o.handle)!==0&&I(`Can't release IO binding.`)),t.jsepOnReleaseSession?.(e),t.webnnOnReleaseSession?.(e),t.webgpuOnReleaseSession?.(e),i.forEach(e=>t._OrtFree(e)),a.forEach(e=>t._OrtFree(e)),t._OrtReleaseSession(r)!==0&&I(`Can't release session.`),zu.delete(e)},Gu=async(e,t,n,r,i,a,o=!1)=>{if(!e){t.push(0);return}let s=F(),c=s.PTR_SIZE,l=e[0],u=e[1],d=e[3],f=d,p,m;if(l===`string`&&(d===`gpu-buffer`||d===`ml-tensor`))throw Error(`String tensor is not supported on GPU.`);if(o&&d!==`gpu-buffer`)throw Error(`External buffer must be provided for input/output index ${a} when enableGraphCapture is true.`);if(d===`gpu-buffer`){let t=e[2].gpuBuffer;m=Ot(Et(l),u);{let e=s.jsepRegisterBuffer;if(!e)throw Error(`Tensor location "gpu-buffer" is not supported without using WebGPU.`);p=e(r,a,t,m)}}else if(d===`ml-tensor`){let t=e[2].mlTensor;m=Ot(Et(l),u);let n=s.webnnRegisterMLTensor;if(!n)throw Error(`Tensor location "ml-tensor" is not supported without using WebNN.`);p=n(r,t,Et(l),u)}else{let t=e[2];if(Array.isArray(t)){m=c*t.length,p=s._malloc(m),n.push(p);for(let e=0;e<t.length;e++){if(typeof t[e]!=`string`)throw TypeError(`tensor data at index ${e} is not a string`);s.setValue(p+e*c,mt(t[e],n),`*`)}}else{let e=s.webnnIsGraphInput,a=s.webnnIsGraphOutput;if(l!==`string`&&e&&a){let o=s.UTF8ToString(i);if(e(r,o)||a(r,o)){let e=Et(l);m=Ot(e,u),f=`ml-tensor`;let n=s.webnnCreateTemporaryTensor,i=s.webnnUploadTensor;if(!n||!i)throw Error(`Tensor location "ml-tensor" is not supported without using WebNN.`);let a=await n(r,e,u);i(a,new Uint8Array(t.buffer,t.byteOffset,t.byteLength)),p=a}else m=t.byteLength,p=s._malloc(m),n.push(p),s.HEAPU8.set(new Uint8Array(t.buffer,t.byteOffset,m),p)}else m=t.byteLength,p=s._malloc(m),n.push(p),s.HEAPU8.set(new Uint8Array(t.buffer,t.byteOffset,m),p)}}let h=s.stackSave(),g=s.stackAlloc(4*u.length);try{u.forEach((e,t)=>s.setValue(g+t*c,e,c===4?`i32`:`i64`));let e=s._OrtCreateTensor(Et(l),p,m,g,u.length,Nt(f));e===0&&I(`Can't create tensor for input/output. session=${r}, index=${a}.`),t.push(e)}finally{s.stackRestore(h)}},Ku=async(e,t,n,r,i,a)=>{let o=F(),s=o.PTR_SIZE,c=zu.get(e);if(!c)throw Error(`cannot run inference. invalid session id: ${e}`);let l=c[0],u=c[1],d=c[2],f=c[3],p=c[4],m=c[5],h=t.length,g=r.length,_=0,v=[],y=[],b=[],x=[],S=[],C=o.stackSave(),w=o.stackAlloc(h*s),T=o.stackAlloc(h*s),E=o.stackAlloc(g*s),D=o.stackAlloc(g*s);try{[_,v]=_t(a),xe(`wasm prepareInputOutputTensor`);for(let r=0;r<h;r++)await Gu(n[r],y,x,e,u[t[r]],t[r],p);for(let t=0;t<g;t++)await Gu(i[t],b,x,e,d[r[t]],h+r[t],p);Se(`wasm prepareInputOutputTensor`);for(let e=0;e<h;e++)o.setValue(w+e*s,y[e],`*`),o.setValue(T+e*s,u[t[e]],`*`);for(let e=0;e<g;e++)o.setValue(E+e*s,b[e],`*`),o.setValue(D+e*s,d[r[e]],`*`);if(f&&!m){let{handle:n,outputPreferredLocations:a,outputPreferredLocationsEncoded:s}=f;if(u.length!==h)throw Error(`input count from feeds (${h}) is expected to be always equal to model's input count (${u.length}).`);xe(`wasm bindInputsOutputs`);for(let r=0;r<h;r++){let i=t[r];await o._OrtBindInput(n,u[i],y[r])!==0&&I(`Can't bind input[${r}] for session=${e}.`)}for(let t=0;t<g;t++){let c=r[t];i[t]?.[3]?(S.push(b[t]),o._OrtBindOutput(n,d[c],b[t],0)!==0&&I(`Can't bind pre-allocated output[${t}] for session=${e}.`)):o._OrtBindOutput(n,d[c],0,s[c])!==0&&I(`Can't bind output[${t}] to ${a[t]} for session=${e}.`)}Se(`wasm bindInputsOutputs`),zu.set(e,[l,u,d,f,p,!0])}o.jsepOnRunStart?.(l),o.webnnOnRunStart?.(l);let c;c=f?await o._OrtRunWithBinding(l,f.handle,g,E,_):await o._OrtRun(l,T,w,h,D,g,E,_),c!==0&&I(`failed to call OrtRun().`);let C=[],O=[];xe(`wasm ProcessOutputTensor`);for(let t=0;t<g;t++){let n=Number(o.getValue(E+t*s,`*`));if(n===b[t]||S.includes(b[t])){C.push(i[t]),n!==b[t]&&o._OrtReleaseTensor(n)!==0&&I(`Can't release tensor.`);continue}let a=o.stackSave(),c=o.stackAlloc(4*s),l=!1,u,d=0;try{o._OrtGetTensorData(n,c,c+s,c+2*s,c+3*s)!==0&&I(`Can't access output tensor data on index ${t}.`);let i=s===4?`i32`:`i64`,a=Number(o.getValue(c,i));d=o.getValue(c+s,`*`);let p=o.getValue(c+s*2,`*`),m=Number(o.getValue(c+s*3,i)),h=[];for(let e=0;e<m;e++)h.push(Number(o.getValue(p+e*s,i)));o._OrtFree(p)!==0&&I(`Can't free memory for tensor dims.`);let g=h.reduce((e,t)=>e*t,1);u=Dt(a);let _=f?.outputPreferredLocations[r[t]];if(u===`string`){if(_===`gpu-buffer`||_===`ml-tensor`)throw Error(`String tensor is not supported on GPU.`);let e=[];for(let t=0;t<g;t++){let n=o.getValue(d+t*s,`*`),r=o.getValue(d+(t+1)*s,`*`),i=t===g-1?void 0:r-n;e.push(o.UTF8ToString(n,i))}C.push([u,h,e,`cpu`])}else if(_===`gpu-buffer`&&g>0){let e=o.jsepGetBuffer;if(!e)throw Error(`preferredLocation "gpu-buffer" is not supported without using WebGPU.`);let t=e(d),r=Ot(a,g);if(r===void 0||!jt(u))throw Error(`Unsupported data type: ${u}`);l=!0,C.push([u,h,{gpuBuffer:t,download:o.jsepCreateDownloader(t,r,u),dispose:()=>{o._OrtReleaseTensor(n)!==0&&I(`Can't release tensor.`)}},`gpu-buffer`])}else if(_===`ml-tensor`&&g>0){let t=o.webnnEnsureTensor,r=o.webnnIsGraphInputOutputTypeSupported;if(!t||!r)throw Error(`preferredLocation "ml-tensor" is not supported without using WebNN.`);if(Ot(a,g)===void 0||!Mt(u))throw Error(`Unsupported data type: ${u}`);if(!r(e,u,!1))throw Error(`preferredLocation "ml-tensor" for ${u} output is not supported by current WebNN Context.`);let i=await t(e,d,a,h,!1);l=!0,C.push([u,h,{mlTensor:i,download:o.webnnCreateMLTensorDownloader(d,u),dispose:()=>{o.webnnReleaseTensorId(d),o._OrtReleaseTensor(n)}},`ml-tensor`])}else if(_===`ml-tensor-cpu-output`&&g>0){let e=o.webnnCreateMLTensorDownloader(d,u)(),t=C.length;l=!0,O.push((async()=>{let r=[t,await e];return o.webnnReleaseTensorId(d),o._OrtReleaseTensor(n),r})()),C.push([u,h,[],`cpu`])}else{let e=new(kt(u))(g);new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(o.HEAPU8.subarray(d,d+e.byteLength)),C.push([u,h,e,`cpu`])}}finally{o.stackRestore(a),u===`string`&&d&&o._free(d),l||o._OrtReleaseTensor(n)}}f&&!p&&(o._OrtClearBoundOutputs(f.handle)!==0&&I(`Can't clear bound outputs.`),zu.set(e,[l,u,d,f,p,!1]));for(let[e,t]of await Promise.all(O))C[e][2]=t;return Se(`wasm ProcessOutputTensor`),C}finally{o.webnnOnRunEnd?.(l),o.stackRestore(C),y.forEach(e=>o._OrtReleaseTensor(e)),b.forEach(e=>o._OrtReleaseTensor(e)),x.forEach(e=>o._free(e)),_!==0&&o._OrtReleaseRunOptions(_),v.forEach(e=>o._free(e))}},qu=e=>{let t=F(),n=zu.get(e);if(!n)throw Error(`invalid session id`);let r=n[0],i=t._OrtEndProfiling(r);i===0&&I(`Can't get an profile file name.`),t._OrtFree(i)},Ju=e=>{let t=[];for(let n of e){let e=n[2];!Array.isArray(e)&&`buffer`in e&&t.push(e.buffer)}return t}}),Xu,Zu,Qu,$u,ed,td,nd,rd,id,ad,od,sd,cd,ld,ud,dd,fd,pd,md=d(()=>{Ne(),Yu(),pt(),it(),Xu=()=>!!D.wasm.proxy&&typeof document<`u`,Qu=!1,$u=!1,ed=!1,rd=new Map,id=(e,t)=>{let n=rd.get(e);n?n.push(t):rd.set(e,[t])},ad=()=>{if(Qu||!$u||ed||!Zu)throw Error(`worker not ready`)},od=e=>{switch(e.data.type){case`init-wasm`:Qu=!1,e.data.err?(ed=!0,nd[1](e.data.err)):($u=!0,nd[0]()),td&&=(URL.revokeObjectURL(td),void 0);break;case`init-ep`:case`copy-from`:case`create`:case`release`:case`run`:case`end-profiling`:{let t=rd.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}}},sd=async()=>{if(!$u){if(Qu)throw Error(`multiple calls to 'initWasm()' detected.`);if(ed)throw Error(`previous call to 'initWasm()' failed.`);if(Qu=!0,Xu())return new Promise((e,t)=>{Zu?.terminate(),tt().then(([n,r])=>{try{Zu=r,Zu.onerror=e=>t(e),Zu.onmessage=od,nd=[e,t];let i={type:`init-wasm`,in:D};!i.in.wasm.wasmPaths&&(n||Ke)&&(i.in.wasm.wasmPaths={wasm:new URL(`/assets/ort-wasm-simd-threaded.jsep-DC5y_g6C.wasm`,``+import.meta.url).href}),Zu.postMessage(i),td=n}catch(e){t(e)}},t)});try{await ft(D.wasm),await Lu(D),$u=!0}catch(e){throw ed=!0,e}finally{Qu=!1}}},cd=async e=>{if(Xu())return ad(),new Promise((t,n)=>{id(`init-ep`,[t,n]);let r={type:`init-ep`,in:{epName:e,env:D}};Zu.postMessage(r)});await Ru(D,e)},ld=async e=>Xu()?(ad(),new Promise((t,n)=>{id(`copy-from`,[t,n]);let r={type:`copy-from`,in:{buffer:e}};Zu.postMessage(r,[e.buffer])})):Hu(e),ud=async(e,t)=>{if(Xu()){if(t?.preferredOutputLocation)throw Error(`session option "preferredOutputLocation" is not supported for proxy.`);return ad(),new Promise((n,r)=>{id(`create`,[n,r]);let i={type:`create`,in:{model:e,options:{...t}}},a=[];e instanceof Uint8Array&&a.push(e.buffer),Zu.postMessage(i,a)})}return Uu(e,t)},dd=async e=>{if(Xu())return ad(),new Promise((t,n)=>{id(`release`,[t,n]);let r={type:`release`,in:e};Zu.postMessage(r)});Wu(e)},fd=async(e,t,n,r,i,a)=>{if(Xu()){if(n.some(e=>e[3]!==`cpu`))throw Error(`input tensor on GPU is not supported for proxy.`);if(i.some(e=>e))throw Error(`pre-allocated output tensor is not supported for proxy.`);return ad(),new Promise((i,o)=>{id(`run`,[i,o]);let s=n,c={type:`run`,in:{sessionId:e,inputIndices:t,inputs:s,outputIndices:r,options:a}};Zu.postMessage(c,Ju(s))})}return Ku(e,t,n,r,i,a)},pd=async e=>{if(Xu())return ad(),new Promise((t,n)=>{id(`end-profiling`,[t,n]);let r={type:`end-profiling`,in:e};Zu.postMessage(r)});qu(e)}}),hd,gd,_d,vd=d(()=>{Ne(),md(),L(),Pe(),Ft(),hd=(e,t)=>{switch(e.location){case`cpu`:return[e.type,e.dims,e.data,`cpu`];case`gpu-buffer`:return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},`gpu-buffer`];case`ml-tensor`:return[e.type,e.dims,{mlTensor:e.mlTensor},`ml-tensor`];default:throw Error(`invalid data location: ${e.location} for ${t()}`)}},gd=e=>{switch(e[3]){case`cpu`:return new _e(e[0],e[2],e[1]);case`gpu-buffer`:{let t=e[0];if(!jt(t))throw Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:n,download:r,dispose:i}=e[2];return _e.fromGpuBuffer(n,{dataType:t,dims:e[1],download:r,dispose:i})}case`ml-tensor`:{let t=e[0];if(!Mt(t))throw Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:n,download:r,dispose:i}=e[2];return _e.fromMLTensor(n,{dataType:t,dims:e[1],download:r,dispose:i})}default:throw Error(`invalid data location: ${e[3]}`)}},_d=class{async fetchModelAndCopyToWasmMemory(e){return ld(await Pt(e))}async loadModel(e,t){be();let n;n=typeof e==`string`?await this.fetchModelAndCopyToWasmMemory(e):e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await ud(n,t),N()}async dispose(){return dd(this.sessionId)}async run(e,t,n){be();let r=[],i=[];Object.entries(e).forEach(e=>{let t=e[0],n=e[1],a=this.inputNames.indexOf(t);if(a===-1)throw Error(`invalid input '${t}'`);r.push(n),i.push(a)});let a=[],o=[];Object.entries(t).forEach(e=>{let t=e[0],n=e[1],r=this.outputNames.indexOf(t);if(r===-1)throw Error(`invalid output '${t}'`);a.push(n),o.push(r)});let s=r.map((e,t)=>hd(e,()=>`input "${this.inputNames[i[t]]}"`)),c=a.map((e,t)=>e?hd(e,()=>`output "${this.outputNames[o[t]]}"`):null),l=await fd(this.sessionId,i,s,o,c,n),u={};for(let e=0;e<l.length;e++)u[this.outputNames[o[e]]]=a[e]??gd(l[e]);return N(),u}startProfiling(){}endProfiling(){pd(this.sessionId)}}}),yd={};f(yd,{OnnxruntimeWebAssemblyBackend:()=>xd,initializeFlags:()=>bd,wasmBackend:()=>Sd});var bd,xd,Sd,Cd=d(()=>{Ne(),md(),vd(),bd=()=>{(typeof D.wasm.initTimeout!=`number`||D.wasm.initTimeout<0)&&(D.wasm.initTimeout=0);let e=D.wasm.simd;if(typeof e!=`boolean`&&e!==void 0&&e!==`fixed`&&e!==`relaxed`&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),D.wasm.simd=!1),typeof D.wasm.proxy!=`boolean`&&(D.wasm.proxy=!1),typeof D.wasm.trace!=`boolean`&&(D.wasm.trace=!1),typeof D.wasm.numThreads!=`number`||!Number.isInteger(D.wasm.numThreads)||D.wasm.numThreads<=0){if(typeof self<`u`&&!self.crossOriginIsolated)D.wasm.numThreads=1;else{let e=typeof navigator>`u`?u(`node:os`).cpus().length:navigator.hardwareConcurrency;D.wasm.numThreads=Math.min(4,Math.ceil((e||1)/2))}}},xd=class{async init(e){bd(),await sd(),await cd(e)}async createInferenceSessionHandler(e,t){let n=new _d;return await n.loadModel(e,t),n}},Sd=new xd});Ne(),Ne(),Ne();var wd=`1.27.0`,Td=Me;{let e=(Cd(),m(yd)).wasmBackend;_(`webgpu`,e,5),_(`webnn`,e,5),_(`cpu`,e,10),_(`wasm`,e,10)}Object.defineProperty(D.versions,"web",{value:wd,enumerable:!0});
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
let Ed={verbose:!1,debug:!1,debugFolder:`out`},Dd={mean:[.485,.456,.406],stdDeviation:[.229,.224,.225],maxSideLength:`auto`,minimumAreaThreshold:20,paddingVertical:.4,paddingHorizontal:.6},Od={imageHeight:48,strategy:`per-line`,crossLineWidthFactor:1,minimumConfidence:.5,charactersDictionary:[],maxCropSourceSideLength:2e3,mainThreadYieldMs:0,recBatchSize:6,rotateVerticalCrops:!0,spaceRecovery:!1},kd={model:{},detection:Dd,recognition:Od,debugging:Ed,session:{executionProviders:[`cpu`],graphOptimizationLevel:`all`,enableCpuMemArena:!0,enableMemPattern:!0,executionMode:`sequential`,interOpNumThreads:0,intraOpNumThreads:0},processing:{engine:`opencv`}};function Ad(e,...t){if(!t.length)return e;let n=t.shift();if(Nd(e)&&Nd(n)){for(let t in n)if(Object.prototype.hasOwnProperty.call(n,t)){if(t===`__proto__`||t===`constructor`||t===`prototype`)continue;let r=n[t],i=e[t];Nd(r)?((!i||!Nd(i))&&(e[t]={}),Ad(e[t],r)):r!==void 0&&(e[t]=r)}}return Ad(e,...t)}async function jd(e,t={}){let{timeoutMs:n=3e5,retries:r=2}=t,i;for(let t=0;t<=r;t++)try{let t=await fetch(e,{signal:AbortSignal.timeout(n)});if(!t.ok)throw Error(`HTTP ${t.status} ${t.statusText}`);return await t.arrayBuffer()}catch(e){i=e,t<r&&await new Promise(e=>setTimeout(e,500*(t+1)))}throw Error(`Failed to fetch ${e} after ${r+1} attempt(s): ${String(i)}`)}function Md(e){return(typeof e==`string`?e:new TextDecoder(`utf-8`).decode(e)).split(/\r?\n/)}function Nd(e){return typeof e==`object`&&!!e&&!Array.isArray(e)&&!(e instanceof Date)&&!(e instanceof RegExp)&&!(e instanceof ArrayBuffer)&&!ArrayBuffer.isView(e)}function Pd(e,t){return e===`auto`?Math.min(1920,Math.max(960,Math.round(t*.75/32)*32)):e}function Fd(e,t,n){let r=e,i=t,a=1;return Math.max(i,r)>n&&(a=n/(i>r?i:r),r=Math.round(r*a),i=Math.round(i*a)),{width:r,height:i,ratio:a}}function Id(e,t,n,r,i){let a=Math.round(e.height*r),o=Math.round(e.height*i),s=e.x-o,c=e.y-a;s=Math.max(0,s),c=Math.max(0,c);let l=Math.min(t,e.x+e.width+o),u=Math.min(n,e.y+e.height+a),d=l-s,f=u-c;return{x:s,y:c,width:d,height:f}}function Ld(e,t,n,r){let i=e.x/t,a=e.y/t,o=e.width/t,s=e.height/t,c=Math.max(0,Math.round(i)),l=Math.max(0,Math.round(a));return{x:c,y:l,width:Math.min(n-c,Math.round(o)),height:Math.min(r-l,Math.round(s))}}function Rd(e,t,n,r,i,a,o,s,c){let l=[];return e.iterate(u=>{let d=e.getRect(u);if(d.width*d.height<=o)return;let f=Ld(Id(d,t,n,s,c),r,i,a);f.width>5&&f.height>5&&l.push(f)}),l}function zd(e,t,n){let r=[];for(let i of e){let{bbox:e}=i,a={x:Math.max(0,e.x0),y:Math.max(0,e.y0),width:e.x1-e.x0,height:e.y1-e.y0};a.x+a.width>t&&(a.width=t-a.x),a.y+a.height>n&&(a.height=n-a.y),a.width>5&&a.height>5&&r.push(a)}return r}function Bd(e,t,n,r,i){let a=e.getContext(`2d`).getImageData(0,0,t,n).data,o=n*t,s=new Float32Array(3*o),c=r[0]??.485,l=r[1]??.456,u=r[2]??.406,d=i[0]??.229,f=i[1]??.224,p=i[2]??.225,m=1/(255*d),h=1/(255*f),g=1/(255*p),_=c/d,v=l/f,y=u/p,b=o,x=o*2;for(let e=0,t=0;e<o;e++,t+=4){let n=a[t],r=a[t+1],i=a[t+2];s[e]=n*m-_,s[b+e]=r*h-v,s[x+e]=i*g-y}return s}function Vd(e,t,n,r){let i=r(t,n),a=i.getContext(`2d`),o=a.createImageData(t,n),s=o.data,c=t*n;for(let t=0;t<c;t++){let n=e[t]||0,r=Math.round(n*255),i=t*4;s[i]=r,s[i+1]=r,s[i+2]=r,s[i+3]=255}return a.putImageData(o,0,0),i}var Hd=class{options;debugging;session;platform;engine;lastDetectionCanvas=null;constructor(e,t,n={},r={},i=`opencv`){this.platform=e,this.session=t,this.options={...Dd,...n},this.debugging={...Ed,...r},this.engine=i===`opencv`&&!this.platform.imageProcessor?`canvas-native`:i}log(e){this.debugging.verbose&&console.log(`[DetectionService] ${e}`)}async run(e){this.log(`Starting text detection process`);try{let t;t=this.platform.isCanvas(e)?e:this.engine===`opencv`&&this.platform.imageProcessor?await this.platform.imageProcessor.prepareCanvas(e):await this.platform.canvas.prepareCanvas(e);let n=await this.preprocessDetection(t),r=await this.runInference(n.tensor,n.width,n.height);if(!r)return console.error(`Text detection failed (output tensor is null)`),[];let i=this.postprocessDetection(r,n);return this.debugging.debug&&this.debugging.debugFolder&&this.lastDetectionCanvas&&(await this.debugDetectionCanvas(this.lastDetectionCanvas,n.width,n.height),await this.debugDetectedBoxes(t,i)),this.log(`Detected ${i.length} text boxes in image`),i}catch(e){return console.error(`Error during text detection:`,e instanceof Error?e.message:String(e)),[]}}async preprocessDetection(e){let{width:t,height:n}=e,{width:r,height:i,ratio:a}=Fd(t,n,Pd(this.options.maxSideLength??`auto`,Math.max(t,n))),o=Math.ceil(r/32)*32,s=Math.ceil(i/32)*32,c=this.platform.createCanvas(o,s);c.getContext(`2d`).drawImage(e,0,0,t,n,0,0,r,i);let l=Bd(c,o,s,this.options.mean??[.485,.456,.406],this.options.stdDeviation??[.229,.224,.225]);return this.log(`Detection preprocessed: original(${t}x${n}), model_input(${o}x${s}), resize_ratio: ${a.toFixed(4)}, engine: ${this.engine}`),{tensor:l,width:o,height:s,resizeRatio:a,originalWidth:t,originalHeight:n}}async runInference(e,t,n){let r;try{this.log(`Running detection inference...`),r=new this.platform.ort.Tensor(`float32`,e,[1,3,n,t]);let i={x:r},a=(await this.session.run(i))[this.session.outputNames[0]||`sigmoid_0.tmp_0`];return this.log(`Detection inference complete!`),a?a.data:(console.error(`Output tensor ${this.session.outputNames[0]} not found in detection results`),null)}catch(e){throw console.error(`Error during model inference:`,e instanceof Error?e.message:String(e)),e}finally{r?.dispose()}}postprocessDetection(e,t,n=this.options.minimumAreaThreshold??50,r=this.options.paddingVertical||.4,i=this.options.paddingHorizontal||.6){this.log(`Post-processing detection results...`);let{width:a,height:o,resizeRatio:s,originalWidth:c,originalHeight:l}=t;if(this.engine===`opencv`&&this.platform.imageProcessor)return this.lastDetectionCanvas=this.debugging.debug&&this.debugging.debugFolder?Vd(e,a,o,this.platform.createCanvas.bind(this.platform)):null,this.postprocessWithOpenCV(e,a,o,s,c,l,n,r,i);let u=Vd(e,a,o,this.platform.createCanvas.bind(this.platform));return this.lastDetectionCanvas=u,this.postprocessWithCanvasNative(u,s,c,l,n,r,i)}postprocessWithOpenCV(e,t,n,r,i,a,o,s,c){let l=this.platform.imageProcessor,u=new l.cv.Mat(n,t,l.cv.CV_8UC1),d=u.data,f=t*n;for(let t=0;t<f;t++){let n=e[t]||0;d[t]=Math.round(Math.min(Math.max(n,0),1)*255)}let p=new l.ImageProcessor(u);try{let e=new l.Contours(p.toMat(),{mode:l.cv.RETR_LIST,method:l.cv.CHAIN_APPROX_SIMPLE}),u=Rd(e,t,n,r,i,a,o,s,c);return e.destroy(),this.log(`Found ${u.length} potential text boxes (opencv)`),u}finally{p.destroy()}}postprocessWithCanvasNative(e,t,n,r,i,a,o){let s=zd(this.platform.canvas.createProcessor(e).grayscale().threshold({thresh:0}).findRegions({foreground:`light`,minArea:i,thresh:0,padding:{vertical:a,horizontal:o},scale:1/t}),n,r);return this.log(`Found ${s.length} potential text boxes (canvas-native)`),s}async debugDetectionCanvas(e,t,n){let r=this.debugging.debugFolder??``;await this.platform.saveDebugImage(e,`detection-debug`,r),this.log(`Probability map visualized and saved to: ${r}`)}async debugDetectedBoxes(e,t){let n=this.platform.isCanvas(e)?e:await this.platform.canvas.prepareCanvas(e),r=n.getContext(`2d`);for(let e of t){let{x:t,y:n,width:i,height:a}=e;this.platform.canvas.getToolkit().drawLine({ctx:r,x:t,y:n,width:i,height:a})}let i=this.debugging.debugFolder??``;await this.platform.saveDebugImage(n,`boxes-debug`,i),this.log(`Boxes visualized and saved to: ${i}`)}};function Ud(e){return e.reason instanceof Error?e.reason:new DOMException(`The batch operation was aborted.`,`AbortError`)}function Wd(e){if(Symbol.asyncIterator in e)return e[Symbol.asyncIterator]();let t=e[Symbol.iterator]();return{next:()=>Promise.resolve(t.next()),return:e=>Promise.resolve(t.return?.(e)??{done:!0,value:void 0})}}async function Gd(e,t,n,r){let{settle:i,signal:a}=t,o=Math.max(1,Math.floor(t.concurrency));if(a?.aborted)throw Ud(a);let s=0,c=0,l=!1,u=!1,d,f=Array.isArray(e)?e:null,p=f?null:Wd(e),m=Promise.resolve(),h=async()=>{let e=m,t;m=new Promise(e=>{t=e}),await e;try{return await p.next()}finally{t()}},g=()=>{l=!0};a?.addEventListener(`abort`,g,{once:!0});let _=async()=>{for(;!l;){let e,a;if(f){if(s>=f.length)return;a=s++,e=f[a]}else{let t=await h();if(t.done||l)return;a=s++,e=t.value}try{let t=await n(e,a);if(l)return;r({index:a,status:`fulfilled`,value:t})}catch(e){if(i)r({index:a,status:`rejected`,reason:e});else{l=!0,u=!0,d=e;return}}finally{c++,t.onProgress?.(c,t.total)}}};try{await Promise.all(Array.from({length:o},()=>_()))}finally{a?.removeEventListener(`abort`,g),await p?.return?.()}if(a?.aborted)throw Ud(a);if(u)throw d}function Kd(){let e=[],t=null,n=!1,r=null,i=()=>{let e=t;t=null,e?.()};return{push(t){e.push(t),i()},close(){n=!0,i()},fail(e){r={error:e},n=!0,i()},async*drain(){for(;;){for(;e.length>0;)yield e.shift();if(r)throw r.error;if(n)return;await new Promise(e=>{t=e})}}}}async function qd(e,t,n,r){let i=e.canvas.getToolkit(),a=[];for(let[o,s]of n.entries()){let n=i.crop({bbox:{x0:s.x,y0:s.y,x1:s.x+s.width,y1:s.y+s.height},canvas:t});if(r.saveCropsTo&&e.saveImage){let t=`crop_${String(o).padStart(3,`0`)}.png`;await e.saveImage(n,[r.saveCropsTo,t].join(e.pathSeparator))}r.crop&&a.push(await Jd(n))}return a}async function Jd(e){let t=e;if(typeof t.toBuffer==`function`){let e=t.toBuffer(`image/png`);return e.buffer.slice(e.byteOffset,e.byteOffset+e.byteLength)}if(typeof t.convertToBlob==`function`)return(await t.convertToBlob({type:`image/png`})).arrayBuffer();if(typeof t.toBlob==`function`){let e=t.toBlob.bind(t);return(await new Promise((t,n)=>e(e=>e?t(e):n(Error(`Canvas toBlob() returned null`)),`image/png`))).arrayBuffer()}throw Error(`Canvas cannot be encoded to a PNG buffer on this platform`)}function Yd(e){return e.length===0?{text:``,results:[],confidence:0}:{text:e.map(e=>e.text).join(` `),results:e,confidence:e.reduce((e,t)=>e+t.confidence,0)/e.length}}function Xd(e){if(e.length===0)return{text:``,lines:[],confidence:0};let t=[],n=[],r=e[0];if(!r)return{text:``,lines:[],confidence:0};let i=r.box.y,a=r.box.height;for(let r of e){let{box:e}=r;Math.abs(e.y-i)<a/2?(n.push(r),a=(a*(n.length-1)+e.height)/n.length):(n.sort((e,t)=>e.box.x-t.box.x),t.push(n),n=[r],i=e.y,a=e.height)}n.length>0&&(n.sort((e,t)=>e.box.x-t.box.x),t.push(n));let o=t.map(e=>e.map(e=>e.text).join(` `)).join(`
`),s=t.reduce((e,t)=>e+t.reduce((e,t)=>e+t.confidence,0),0),c=t.reduce((e,t)=>e+t.length,0);return{text:o,lines:t,confidence:c>0?s/c:0}}function Zd(e){if(e.length===0)return[];let t=[...e].sort((e,t)=>e.box.y-t.box.y||e.box.x-t.box.x),n=[],r=t[0];if(!r)return[];let i=[r],a=r.box.height,o=r.box.height;for(let e=1;e<t.length;e++){let r=t[e],s=t[e-1];!r||!s||(Math.abs(r.box.y-s.box.y)<=o*.5?(i.push(r),a+=r.box.height,o=a/i.length):(i.sort((e,t)=>e.box.x-t.box.x),n.push(i),i=[r],a=r.box.height,o=r.box.height))}return i.length>0&&(i.sort((e,t)=>e.box.x-t.box.x),n.push(i)),n}let Qd=16384;function $d(e,t,n,r){let i=Math.min(...t.map(e=>e.box.x)),a=Math.min(...t.map(e=>e.box.y)),o=Math.max(...t.map(e=>e.box.x+e.box.width)),s=Math.max(...t.map(e=>e.box.y+e.box.height)),c={x:i,y:a,width:o-i,height:s-a},l=s-a,u=Math.max(1,Math.round(l*.4)),d=t.map(({box:e})=>Math.max(1,Math.round(e.width*Math.min(l/e.height,4)))),f=d.reduce((e,t)=>e+t,0)+u*(t.length-1);if(f>Qd){let e=Qd/f;d=d.map(t=>Math.max(1,Math.round(t*e))),u=Math.max(1,Math.floor(u*e))}let p=d.reduce((e,t)=>e+t,0)+u*(t.length-1),m=n(p,l),h=m.getContext(`2d`);h.fillStyle=`white`,h.fillRect(0,0,p,l);let g=0,_=[];for(let n=0;n<t.length;n++){let i=t[n],a=d[n];if(!i||a===void 0)continue;let{box:o}=i,s=r.getToolkit().crop({bbox:{x0:o.x,y0:o.y,x1:o.x+o.width,y1:o.y+o.height},canvas:e});h.drawImage(s,0,0,o.width,o.height,g,0,a,l);let c=n<t.length-1?u:0;_.push(a+c),g+=a+c}return{mergedCanvas:m,mergedBox:c,cropWidths:_}}function ef(e,t,n){let r=[...e];if(t.length!==r.length||n.length===0)return tf(e,n);let i=n.reduce((e,t)=>e+t,0),a=n.map(()=>``),o=0,s=(n[0]??0)/i;for(let e=0;e<r.length;e++){let c=t[e]??0;for(;c>=s&&o<n.length-1;)o++,s+=(n[o]??0)/i;a[o]+=r[e]??``}return a}function tf(e,t){if(t.length===1)return[e];let n=t.reduce((e,t)=>e+t,0),r=[...e],i=r.length>0?n/r.length:0,a=[],o=0;for(let e=0;e<t.length;e++){if(e===t.length-1){a.push(r.slice(o).join(``));break}let n=Math.min(o+Math.round((t[e]??0)/i),r.length),s=n,c=!1;for(let e=0;e<=4&&!c;e++)for(let t of[n-e,n+e]){let e=r[t];if(t>o&&t<r.length&&e!==void 0&&/\s/.test(e)){s=t,c=!0;break}}a.push(r.slice(o,s).join(``)),o=c?s+1:s}return a}function nf(e,t,n,r){let i=[...e].sort((e,n)=>t(n)-t(e)),a=[],o=[];for(let e of i){let i=!1;for(let s=0;s<a.length;s++){let c=a[s],l=o[s];if(c!==void 0&&l!==void 0&&l+r*c.length+t(e)<=n){c.push(e),o[s]=l+t(e),i=!0;break}}i||(a.push([e]),o.push(t(e)))}return a}var rf=class{cache=new Map;maxSize;constructor(e=10){this.maxSize=e}get(e){let t=this.cache.get(e);if(t!==void 0)return this.cache.delete(e),this.cache.set(e,t),t}set(e,t){if(this.cache.has(e))this.cache.delete(e);else if(this.cache.size>=this.maxSize){let e=this.cache.keys().next().value;e!==void 0&&this.cache.delete(e)}this.cache.set(e,t)}clear(){this.cache.clear()}static generateKey(e){let t=new Uint8Array(e),n=Math.min(t.length,1024),r=0;for(let e=0;e<n;e++)r=(r<<5)-r+t[e],r&=r;return`${r}_${t.length}`}};let af=new rf;var of=class{options=kd;detectionSession=null;recognitionSession=null;detector=null;recognitor=null;platform;constructor(e,t){this.platform=e,this.options=Ad({},kd,t),this.options.session=this.options.session||kd.session}log(e){this.options.debugging?.verbose&&console.log(`[PaddleOcrService:Base] ${e}`)}async recognize(e,t){(!this.detector||!this.recognitor)&&await this.initSessions();try{let n;if(typeof e==`string`){if(!e.startsWith(`http`)&&!e.startsWith(`/`))throw Error(`Invalid image string format. Must be an HTTP URL, an absolute path, ArrayBuffer, or Canvas`);n=await this.platform.loadResource(e,e)}else if(e instanceof ArrayBuffer)n=e;else if(typeof e.toBuffer==`function`){let t=e.toBuffer(`image/png`);n=t.buffer.slice(t.byteOffset,t.byteOffset+t.byteLength)}else{let t=e,r=t.getContext(`2d`,{willReadFrequently:!0}).getImageData(0,0,t.width,t.height).data;n=r.buffer.slice(r.byteOffset,r.byteOffset+r.byteLength)}let r=rf.generateKey(n);if(!t?.noCache&&!t?.dictionary){let e=af.get(r);if(e)return this.log(`Using cached OCR result`),t?.flatten?{text:e.text,results:e.lines?e.lines.flat():e.results??[],confidence:e.confidence}:e}let i=[],a=typeof e==`string`||e instanceof ArrayBuffer?await this.platform.canvas.prepareCanvas(n):e;if(i=await this.detector.run(a),i.length===0)return t?.flatten?{text:``,results:[],confidence:0}:{text:``,lines:[],confidence:0};let o=this.options.recognition?.charactersDictionary;if(t?.dictionary){let e=``;if(typeof t.dictionary==`string`){let n=await this.platform.loadResource(t.dictionary,t.dictionary);e=new TextDecoder(`utf-8`).decode(n)}else e=new TextDecoder(`utf-8`).decode(t.dictionary);o=Md(e)}let s=t?.strategy??this.options.recognition?.strategy??`per-line`,c=await this.recognitor.run(a,i,o,s),l=Xd(c),u=t?.flatten?Yd(c):l;return!t?.noCache&&!t?.dictionary&&af.set(r,u),u}catch(e){let t=e instanceof Error?e:Error(String(e));throw console.error(`recognize: error`,t.message,t.stack),e}}async detect(e,t){this.detector||await this.initSessions();let{crop:n,saveCropsTo:r,...i}=t??{},a=Object.keys(i).length>0?new Hd(this.platform,this.detectionSession,{...this.options.detection,...i},this.options.debugging,this.options.processing?.engine??`opencv`):this.detector,o;if(typeof e==`string`){if(!e.startsWith(`http`)&&!e.startsWith(`/`))throw Error(`Invalid image string format. Must be an HTTP URL, an absolute path, ArrayBuffer, or Canvas`);o=await this.platform.canvas.prepareCanvas(await this.platform.loadResource(e,e))}else o=e instanceof ArrayBuffer?await this.platform.canvas.prepareCanvas(e):e;let s=(await a.run(o)).filter(e=>e.width>0&&e.height>0);if(!n&&!r)return{boxes:s};let c=await qd(this.platform,o,s,{crop:n,saveCropsTo:r});return n?{boxes:s,crops:c}:{boxes:s}}async batchRecognize(e,t){let n=t?.settle??!1,r=[];return await Gd(e,{concurrency:this.resolveConcurrency(t?.concurrency),settle:n,signal:t?.signal,onProgress:t?.onProgress,total:Array.isArray(e)?e.length:void 0},e=>this.recognize(e,t),e=>{r[e.index]=e}),n?r:r.map(e=>e.status===`fulfilled`?e.value:void 0)}async*batchRecognizeStream(e,t){let n=Kd(),r=(async()=>{try{await Gd(e,{concurrency:this.resolveConcurrency(t?.concurrency),settle:t?.settle??!1,signal:t?.signal,onProgress:t?.onProgress,total:Array.isArray(e)?e.length:void 0},e=>this.recognize(e,t),e=>n.push(e)),n.close()}catch(e){n.fail(e)}})();yield*n.drain(),await r}resolveConcurrency(e){return typeof e==`number`&&e>0?Math.floor(e):(this.options.session?.executionProviders??[]).some(e=>{let t=(typeof e==`string`?e:e.name).toLowerCase();return t!==`cpu`&&t!==`wasm`})?1:4}};let sf=new Set([`cpu`,`wasm`]);function cf(e){return typeof e==`string`?e:e.name}async function lf(e,t,n,r,i){let a=n??{};try{return await e.InferenceSession.create(t,a)}catch(n){let o=(a.executionProviders??[]).map(cf);if(o.every(e=>sf.has(e))||o.length===0)throw n;let s=o.find(e=>sf.has(e))??(o.includes(`wasm`)?`wasm`:`cpu`),c=n instanceof Error?n.message:String(n);r(`executionProviders=${JSON.stringify(o)} failed (${c}); falling back to ["${s}"].`);let l={...a,executionProviders:[s]};return i?.(l),e.InferenceSession.create(t,l)}}let uf=null;function df(e){uf=e}function ff(){if(!uf)throw Error(`No canvas platform registered. Import "ppu-ocv" (Node), "ppu-ocv/web" (browser), "ppu-ocv/canvas" (Node canvas-only), "ppu-ocv/canvas-web" (browser canvas-only), or "ppu-ocv/canvas-mobile" (React Native / Skia) to auto-register.`);return uf}function pf(e){return typeof e==`object`&&!!e&&typeof e.getContext==`function`&&typeof e.width==`number`&&typeof e.height==`number`}let mf={createCanvas(e,t){if(typeof OffscreenCanvas<`u`)return new OffscreenCanvas(e,t);if(typeof document<`u`){let n=document.createElement(`canvas`);return n.width=e,n.height=t,n}throw Error(`No canvas implementation available in this environment.`)},async loadImage(e){let t;if(e instanceof ArrayBuffer)t=new Blob([e]);else if(typeof e==`string`)t=await(await fetch(e)).blob();else throw Error(`loadImage: unsupported source type`);let n=await createImageBitmap(t),r=mf.createCanvas(n.width,n.height);return r.getContext(`2d`).drawImage(n,0,0),n.close(),r},isCanvas(e){return typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof OffscreenCanvas<`u`&&e instanceof OffscreenCanvas}};var hf=class e{static _baseInstance=null;step=0;constructor(){}static getInstance(){return e._baseInstance||=new e,e._baseInstance}crop(e){let{bbox:t,canvas:n}=e,r=ff().createCanvas(t.x1-t.x0,t.y1-t.y0);return r.getContext(`2d`).drawImage(n,t.x0,t.y0,t.x1-t.x0,t.y1-t.y0,0,0,r.width,r.height),r}isDirty(e){let{canvas:t,threshold:n=127.5,majorColorThreshold:r=.97}=e,i=0,a=0,o=this.crop({bbox:{x0:t.width*.1,y0:t.height*.1,x1:t.width*.9,y1:t.height*.9},canvas:t}),s=o.getContext(`2d`).getImageData(0,0,o.width,o.height).data;for(let e=0;e<s.length;e+=4){let t=s[e],r=s[e+1],o=s[e+2];t>=n&&r>=n&&o>=n?i++:a++}return Math.max(i,a)/(a+i)<r}drawLine(e){let{ctx:t,x:n,y:r,width:i,height:a,lineWidth:o=2,color:s=`blue`}=e;t.beginPath(),t.strokeStyle=s,t.lineWidth=o,t.strokeRect(n,r,i,a),t.closePath()}drawContour(e){let{ctx:t,contour:n,strokeStyle:r=`red`,lineWidth:i=2}=e,a=n.data32S;if(!(a.length<4)){t.strokeStyle=r,t.lineWidth=i,t.beginPath(),t.moveTo(a[0]??0,a[1]??0);for(let e=2;e<a.length;e+=2)t.lineTo(a[e]??0,a[e+1]??0);t.closePath(),t.stroke()}}};async function gf(e){return pf(e)?e:ff().loadImage(e)}async function _f(e){if(e instanceof ArrayBuffer)return e;if(typeof e.toBuffer==`function`){let t=e.toBuffer(`image/png`),n=new ArrayBuffer(t.byteLength);return new Uint8Array(n).set(new Uint8Array(t)),n}let t=e.toBlob;if(typeof t==`function`)return(await new Promise((n,r)=>{t.call(e,e=>e?n(e):r(Error(`toBlob returned null`)),`image/png`)})).arrayBuffer();if(typeof e.convertToBlob==`function`)return(await e.convertToBlob({type:`image/png`})).arrayBuffer();if(typeof e.toDataURL==`function`){let t=e.toDataURL(`image/png`).replace(/^data:image\/png;base64,/,``),n=atob(t),r=new ArrayBuffer(n.length),i=new Uint8Array(r);for(let e=0;e<n.length;e++)i[e]=n.charCodeAt(e);return r}let n=e.getContext(`2d`).getImageData(0,0,e.width,e.height),r=new ArrayBuffer(n.data.byteLength);return new Uint8Array(r).set(new Uint8Array(n.data.buffer,n.data.byteOffset,n.data.byteLength)),r}function vf(e,t,n,r={}){let{foreground:i=`light`,thresh:a=127,minArea:o=1,maxArea:s=1/0,padding:c,scale:l=1}=r,u=new Uint8Array(t*n),d=[],f=[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]],p=t=>{let n=e[t]??0;return i===`light`?n>a:n<=a};for(let e=0;e<n;e++)for(let r=0;r<t;r++){let i=e*t+r;if(u[i]||(u[i]=1,!p(i*4)))continue;let a=[i],m=r,h=r,g=e,_=e,v=0;for(;a.length>0;){let e=a.pop();if(e===void 0)break;v++;let r=e%t,i=(e-r)/t;r<m?m=r:r>h&&(h=r),i<g?g=i:i>_&&(_=i);for(let[e,o]of f){let s=r+e,c=i+o;if(s<0||s>=t||c<0||c>=n)continue;let l=c*t+s;u[l]||(u[l]=1,p(l*4)&&a.push(l))}}if(v>=o&&v<=s){let e=m,r=g,i=h+1,a=_+1;if(c){let o=a-r,s=Math.round(o*(c.vertical??0)),l=Math.round(o*(c.horizontal??0));e=Math.max(0,e-l),r=Math.max(0,r-s),i=Math.min(t,i+l),a=Math.min(n,a+s)}l!==1&&(e=Math.max(0,Math.round(e*l)),r=Math.max(0,Math.round(r*l)),i=Math.round(i*l),a=Math.round(a*l)),d.push({bbox:{x0:e,y0:r,x1:i,y1:a},area:v})}}return d}var yf=class{_canvas;constructor(e){this._canvas=e}get width(){return this._canvas.width}get height(){return this._canvas.height}resize(e){let{width:t,height:n}=e,r=ff().createCanvas(t,n);return r.getContext(`2d`).drawImage(this._canvas,0,0,t,n),this._canvas=r,this}grayscale(){let{width:e,height:t}=this._canvas,n=this._canvas.getContext(`2d`).getImageData(0,0,e,t),r=n.data;for(let e=0;e<r.length;e+=4){let t=Math.round(.299*(r[e]??0)+.587*(r[e+1]??0)+.114*(r[e+2]??0));r[e]=t,r[e+1]=t,r[e+2]=t}let i=ff().createCanvas(e,t);return i.getContext(`2d`).putImageData(n,0,0),this._canvas=i,this}convert(e={}){let{alpha:t=1,beta:n=0}=e;if(t===1&&n===0)return this;let{width:r,height:i}=this._canvas,a=this._canvas.getContext(`2d`).getImageData(0,0,r,i),o=a.data;for(let e=0;e<o.length;e+=4)o[e]=Math.round((o[e]??0)*t+n),o[e+1]=Math.round((o[e+1]??0)*t+n),o[e+2]=Math.round((o[e+2]??0)*t+n);let s=ff().createCanvas(r,i);return s.getContext(`2d`).putImageData(a,0,0),this._canvas=s,this}invert(){let{width:e,height:t}=this._canvas,n=this._canvas.getContext(`2d`).getImageData(0,0,e,t),r=n.data;for(let e=0;e<r.length;e+=4)r[e]=255-(r[e]??0),r[e+1]=255-(r[e+1]??0),r[e+2]=255-(r[e+2]??0);let i=ff().createCanvas(e,t);return i.getContext(`2d`).putImageData(n,0,0),this._canvas=i,this}threshold(e={}){let{thresh:t=127,maxValue:n=255}=e,{width:r,height:i}=this._canvas,a=this._canvas.getContext(`2d`).getImageData(0,0,r,i),o=a.data;for(let e=0;e<o.length;e+=4){let r=(o[e]===o[e+1]&&o[e+1]===o[e+2]?o[e]??0:Math.round(.299*(o[e]??0)+.587*(o[e+1]??0)+.114*(o[e+2]??0)))>t?n:0;o[e]=r,o[e+1]=r,o[e+2]=r}let s=ff().createCanvas(r,i);return s.getContext(`2d`).putImageData(a,0,0),this._canvas=s,this}border(e={}){let{size:t=10,color:n=`white`}=e,{width:r,height:i}=this._canvas,a=ff().createCanvas(r+t*2,i+t*2),o=a.getContext(`2d`);return o.fillStyle=n,o.fillRect(0,0,a.width,a.height),o.drawImage(this._canvas,t,t),this._canvas=a,this}rotate(e){let{angle:t,cx:n=this._canvas.width/2,cy:r=this._canvas.height/2}=e;if(t===0)return this;let{width:i,height:a}=this._canvas,o=ff().createCanvas(i,a),s=o.getContext(`2d`);return s.save(),s.translate(n,r),s.rotate(-t*Math.PI/180),s.drawImage(this._canvas,-n,-r),s.restore(),this._canvas=o,this}findRegions(e={}){let{width:t,height:n}=this._canvas,r=this._canvas.getContext(`2d`).getImageData(0,0,t,n).data;return vf(r,t,n,e)}toCanvas(){return this._canvas}static async prepareCanvas(e){return gf(e)}static async prepareBuffer(e){return _f(e)}};df(mf);var bf=class{pathSeparator=`/`;ort=a;createCanvas(e,t){let n=ff().createCanvas(e,t);return n.getContext.bind(n)(`2d`,{willReadFrequently:!0}),n}isCanvas(e){return!!e&&typeof e.getContext==`function`}async loadResource(e,t){if(e instanceof ArrayBuffer)return e;let n=typeof e==`string`?e:t,r=await fetch(n);if(!r.ok)throw Error(`Failed to fetch resource from ${n}`);return r.arrayBuffer()}async saveDebugImage(e,t,n){return Promise.resolve()}canvas={prepareCanvas:e=>yf.prepareCanvas(e),createProcessor:e=>new yf(e),getToolkit:()=>hf.getInstance()}};function xf(){return`https://cdn.jsdelivr.net/npm/onnxruntime-web@${D.versions.web??D.versions.common}/dist/`}function Sf(){return typeof globalThis.WorkerGlobalScope==`function`}function Cf(){!(typeof window<`u`||Sf())||D.wasm.wasmPaths||(D.wasm.wasmPaths=xf())}Cf();async function wf(){if(typeof navigator>`u`)return!1;let e=navigator;if(!e.gpu||typeof e.gpu.requestAdapter!=`function`)return!1;try{return await e.gpu.requestAdapter()!=null}catch{return!1}}async function Tf(){return await wf()?[`webgpu`,`wasm`]:[`wasm`]}var Ef=class extends Hd{constructor(e,t={},n={}){super(new bf,e,t,n,`canvas-native`)}},Df=t({BLANK_INDEX:()=>0,MIN_CROP_WIDTH:()=>8,UNK_TOKEN:()=>Of,ctcGreedyDecode:()=>Nf,decodeLogitsRow:()=>Ff,decodeResults:()=>Pf,injectGapSpaces:()=>Af,refineDecodedChars:()=>Mf});let Of=`<unk>`;function kf(e){return/\p{L}/u.test(e)?0:/\p{N}/u.test(e)?1:2}function Af(e,t){if(e.length<4)return;let n=[];for(let e=1;e<t.length;e++)n.push((t[e]??0)-(t[e-1]??0));let r=[...n].sort((e,t)=>e-t),i=r[Math.floor(r.length/2)]??0;if(i<=0)return;let a=r.find(e=>e>0)??0;if(!(a<=0))for(let n=e.length-1;n>=1;n--){let r=t[n-1]??0,o=t[n]??0,s=kf(e[n]??``)===kf(e[n-1]??``)?2.5:1.5;o-r>i+s*a&&e[n]!==` `&&e[n-1]!==` `&&e[n]!==e[n-1]&&(e.splice(n,0,` `),t.splice(n,0,(r+o)/2))}}let jf=/[\u2E80-\u9FFF\uAC00-\uD7AF\uF900-\uFAFF]/;function Mf(e,t){for(let n=e.length-1;n>=1;n--)e[n]===` `&&e[n-1]===` `&&(e.splice(n,1),t.splice(n,1));if(!jf.test(e.join(``)))for(let t=0;t<e.length;t++){let n=e[t]?.codePointAt(0)??0;n>=65281&&n<=65374?e[t]=String.fromCodePoint(n-65248):n===12288&&(e[t]=` `)}}function Nf(e,t,n,r,i=!1){let a=r.length,o=a-1,s=[],c=-1,l=0,u=0,d=[];for(let f=0;f<t;f++){let p=f*n,m=e[p],h=0;for(let t=1;t<n;t++){let n=e[p+t];n>m&&(m=n,h=t)}if(h===0||h===c){c=h;continue}if(h>=0&&h<a){i&&h!==o&&(e[p+o]??0)>.001&&s[s.length-1]!==` `&&(s.push(` `),d.push((f+.5)/t));let n=r[h]??``;h===o?n!==`<unk>`&&(s.push(` `),l+=m,u++,d.push((f+.5)/t)):(s.push(n),l+=m,u++,d.push((f+.5)/t))}c=h}Af(s,d),Mf(s,d);let f=u>0?l/u:0;return{text:s.join(``),confidence:f,positions:d}}function Pf(e,t,n,r=!1,i=!1){let a=e.data,o=e.dims,s=o[1],c=o[2]??n;if(!t)return{text:``,confidence:0,positions:[]};let l=t;return t.length===c-1?l=[``,...t]:c!==t.length&&r&&console.warn(`Warning: Model output classes (${c}) does not match dictionary length (${t.length}).
 Consider using our model & dictionary catalogue at https://github.com/PT-Perkasa-Pilar-Utama/ppu-paddle-ocr-models.`),Nf(a,s,c,l,i)}function Ff(e,t,n,r,i=!1){let a=r;return r.length===n-1&&(a=[``,...r]),Nf(e,t,n,a,i)}var If=t({createImageTensor:()=>Rf,createImageTensorFromCanvas:()=>zf,createImageTensorFromMat:()=>Bf,preprocessImage:()=>Lf});async function Lf(e,t,n,r){let i=e.width,a=e.height;if(a===0||i===0)throw Error(`Crop dimensions are zero: ${i}x${a}`);let o=i/a,s=Math.max(8,Math.round(t*o));if(n){let r=new n.ImageProcessor(e);try{r.resize({width:s,height:t});let e=r.toMat();return e.isContinuous()&&(e.channels()===4||e.channels()===1)?{imageTensor:Bf(e,s,t),tensorWidth:s,tensorHeight:t}:{imageTensor:zf(r.toCanvas(),s,t),tensorWidth:s,tensorHeight:t}}finally{r.destroy()}}return{imageTensor:Rf(r(e).resize({width:s,height:t}),s,t),tensorWidth:s,tensorHeight:t}}function Rf(e,t,n){return zf(e.toCanvas(),t,n)}function zf(e,t,n){let r=e.getContext(`2d`).getImageData(0,0,t,n).data,i=n*t,a=new Float32Array(3*i);for(let e=0,t=0;e<i;e++,t+=4)a[e]=(r[t]??0)*.00784313725490196-1;return a.copyWithin(i,0,i),a.copyWithin(i*2,0,i),a}function Bf(e,t,n){let r=e.channels(),i=e.data,a=n*t,o=new Float32Array(3*a);for(let e=0,t=0;e<a;e++,t+=r)o[e]=i[t]*.00784313725490196-1;return o.copyWithin(a,0,a),o.copyWithin(a*2,0,a),o}async function Vf(e,t,n){let r=t.options.imageHeight??48,i=Math.max(1,t.options.recBatchSize??6),a=n??t.options.charactersDictionary??[],o=t.options.spaceRecovery??!1,s=t.engine===`opencv`?t.platform.imageProcessor:void 0,c=await Promise.all(e.map(e=>Lf(e,r,s,t.platform.canvas.createProcessor.bind(t.platform.canvas)))),l=c.map((e,t)=>t).sort((e,t)=>(c[e]?.tensorWidth??0)-(c[t]?.tensorWidth??0)),u=Array.from({length:e.length});for(let e=0;e<l.length;e+=i){let n=l.slice(e,e+i),s=Math.max(...n.map(e=>c[e]?.tensorWidth??1)),d=r*s,f=new Float32Array(n.length*3*d);n.forEach((e,t)=>{let n=c[e];if(!n)return;let i=t*3*d;for(let e=0;e<3;e++)for(let t=0;t<r;t++){let a=(e*r+t)*n.tensorWidth,o=i+(e*r+t)*s;f.set(n.imageTensor.subarray(a,a+n.tensorWidth),o);let c=n.imageTensor[a+n.tensorWidth-1]??0;f.fill(c,o+n.tensorWidth,o+s)}});let p;try{p=new t.platform.ort.Tensor(`float32`,f,[n.length,3,r,s]);let e=await t.runInference(p),[,i,l]=e.dims,d=e.data,m=(i??0)*(l??0);n.forEach((e,t)=>{let n=(c[e]?.tensorWidth??s)/s,r=Math.max(1,Math.min(i??0,Math.ceil((i??0)*n)));u[e]=Ff(d.subarray(t*m,t*m+r*(l??0)),r,l??0,a,o)})}finally{p?.dispose()}}return u}function Hf(e){let t=e.inputMetadata?.[0]?.shape?.[0];return typeof t!=`number`||t<0}function Uf(e,t){if(!(t.options.rotateVerticalCrops??!0)||e.height/e.width<1.5)return e;let n=t.platform.createCanvas(e.height,e.width),r=n.getContext(`2d`);return r.translate(0,e.width),r.rotate(-Math.PI/2),r.drawImage(e,0,0),n}function Wf(e,t,n){return n.getToolkit().crop({bbox:{x0:t.x,y0:t.y,x1:t.x+t.width,y1:t.y+t.height},canvas:e})}async function Gf(e,t,n){let{imageTensor:r,tensorWidth:i,tensorHeight:a}=await Lf(e,t.options.imageHeight??48,t.engine===`opencv`?t.platform.imageProcessor:void 0,t.platform.canvas.createProcessor.bind(t.platform.canvas)),o;try{return o=new t.platform.ort.Tensor(`float32`,r,[1,3,a,i]),Pf(await t.runInference(o),n??t.options.charactersDictionary??[],i,t.debugging.verbose)}finally{o?.dispose()}}function Kf(e){return[...e].sort((e,t)=>Math.abs(e.box.y-t.box.y)<(e.box.height+t.box.height)/4?e.box.x-t.box.x:e.box.y-t.box.y)}async function qf(e,t,n,r,i){let a=n.debugging.debugFolder?`${n.debugging.debugFolder}${n.platform.pathSeparator}crops`:``;if(n.debugging.debug&&a){let e=n.platform.canvas.getToolkit();`clearOutput`in e&&typeof e.clearOutput==`function`&&e.clearOutput(a)}if(!n.debugging.debug){let r=await Vf(t.map(({box:t})=>Uf(Wf(e,t,n.platform.canvas),n)),n,i);return Kf(t.map(({box:e},t)=>({text:r[t]?.text??``,box:e,confidence:r[t]?.confidence??0})))}let o=[];for(let{box:n,index:s}of t){let c=await r(e,n,s,t.length,a,i);c!==null&&o.push(c)}return Kf(o)}async function Jf(e,t,n,r){let i=Zd(t),a=[],o=[];for(let t of i){let r=t[0];if(r){if(t.length===1)o.push(Uf(Wf(e,r.box,n.platform.canvas),n)),a.push({lineBoxes:t,cropWidths:null});else{let{mergedCanvas:r,cropWidths:i}=$d(e,t,n.platform.createCanvas.bind(n.platform),n.platform.canvas);o.push(r),a.push({lineBoxes:t,cropWidths:i})}}}let s=await Vf(o,n,r),c=[];return a.forEach((e,t)=>{let n=s[t];if(n){if(e.cropWidths===null){let t=e.lineBoxes[0];t&&c.push({text:n.text,box:t.box,confidence:n.confidence})}else{let t=ef(n.text,n.positions,e.cropWidths);for(let r=0;r<e.lineBoxes.length;r++){let i=e.lineBoxes[r];i&&c.push({text:(t[r]??``).trim(),box:i.box,confidence:n.confidence})}}}}),Kf(c)}async function Yf(e,t,n,r){let i=Zd(t),a=n.options.imageHeight??48,o=[];for(let t of i)if(t.length===1){let r=t[0];if(!r)continue;let i=Wf(e,r.box,n.platform.canvas);o.push({canvas:i,boxes:t,cropWidths:[i.width]})}else{let{mergedCanvas:r,cropWidths:i}=$d(e,t,n.platform.createCanvas.bind(n.platform),n.platform.canvas);o.push({canvas:r,boxes:t,cropWidths:i})}let s=o.map(({canvas:e,boxes:t,cropWidths:n},r)=>{let i=e.width/e.height;return{canvas:e,boxes:t,cropWidths:n,resizedWidth:Math.max(8,Math.round(a*i)),originalHeight:e.height,index:r}}),c=Math.max(...s.map(e=>e.resizedWidth)),l=n.options.crossLineWidthFactor??1.5,u=nf(s,e=>e.resizedWidth,Math.round(c*l),20),d=[];for(let e of u){let t=[...e].sort((e,t)=>e.index-t.index),i=Math.max(...t.map(e=>e.originalHeight)),o=t.map(e=>{if(e.originalHeight>=i)return e.resizedWidth;let t=i/e.originalHeight;return Math.max(8,Math.round(e.resizedWidth*t))}),s=o.reduce((e,t)=>e+t,0)+20*(t.length-1),c=n.platform.createCanvas(s,a),l=c.getContext(`2d`);l.fillStyle=`white`,l.fillRect(0,0,s,a);let u=0;for(let e=0;e<t.length;e++){let n=t[e],r=o[e];n!==void 0&&r!==void 0&&(l.drawImage(n.canvas,0,0,n.canvas.width,n.canvas.height,u,0,r,a),u+=r,e<t.length-1&&(u+=20))}let{text:f,confidence:p,positions:m}=await Gf(c,n,r),h=[],g=[];for(let e=0;e<t.length;e++){let n=t[e],r=o[e];if(!n||r===void 0)continue;let i=r/n.canvas.width;for(let r=0;r<n.boxes.length;r++){let a=n.boxes[r];if(!a)continue;let o=(n.cropWidths[r]??0)*i;r===n.boxes.length-1&&e<t.length-1&&(o+=20),h.push(o),g.push(a)}}let _=ef(f,m,h);for(let e=0;e<g.length;e++){let t=g[e];t&&d.push({text:(_[e]??``).trim(),box:t.box,confidence:p})}}return Kf(d)}var Xf=class{options;debugging;session;platform;engine;constructor(e,t,n={},r={},i=`opencv`){this.platform=e,this.session=t,this.options={...Od,...n},this.debugging={...Ed,...r},this.engine=i===`opencv`&&!this.platform.imageProcessor?`canvas-native`:i}log(e){this.debugging.verbose&&console.log(`[RecognitionService] ${e}`)}async run(e,t,n,r=`per-line`){this.log(`Starting text recognition process`);try{let i;i=this.platform.isCanvas(e)?e:this.engine===`opencv`&&this.platform.imageProcessor?await this.platform.imageProcessor.prepareCanvas(e):await this.platform.canvas.prepareCanvas(e);let a=this.filterValidBoxes(t);if(a.length===0)return[];let{canvas:o,ratio:s}=this.buildCropCanvas(i),c=s===1?a:a.map(e=>({...e,box:Zf(e.box,s)})),l=this.buildContext(),u;switch(r){case`cross-line`:u=await Yf(o,c,l,n);break;case`per-line`:u=await Jf(o,c,l,n);break;default:u=await qf(o,c,l,(e,t,n,r,i,a)=>this.processBox(e,t,n,r,i,a),n)}s!==1&&(u=u.map(e=>({...e,box:Zf(e.box,1/s)})));let d=this.options.minimumConfidence??.5;return d>0?u.filter(e=>{let t=/[\p{L}\p{N}]/u.test(e.text)?d:Math.min(1,d+.3);return e.confidence>=t}):u}catch(e){return console.error(`Error during text recognition:`,e instanceof Error?e.message:String(e)),[]}}buildContext(){return{platform:this.platform,options:Hf(this.session)?this.options:{...this.options,recBatchSize:1},debugging:this.debugging,engine:this.engine,runInference:e=>this.runInference(e)}}filterValidBoxes(e){return e.map((e,t)=>({box:e,index:t})).filter(({box:e,index:t})=>this.isValidBox(e,t))}buildCropCanvas(e){let{width:t,height:n}=e,{width:r,height:i,ratio:a}=Fd(t,n,this.options.maxCropSourceSideLength??2e3);if(a===1)return{canvas:e,ratio:1};let o=this.platform.createCanvas(r,i);return o.getContext(`2d`).drawImage(e,0,0,t,n,0,0,r,i),{canvas:o,ratio:a}}async processBox(e,t,n,r,i,a){let o=Date.now();try{let s=this.platform.canvas.getToolkit().crop({bbox:{x0:t.x,y0:t.y,x1:t.x+t.width,y1:t.y+t.height},canvas:e}),c=this.buildContext(),{text:l,confidence:u}=await this.recognizeTextViaContext(s,c,a);if(this.debugging.debug&&i){await this.platform.saveDebugImage(s,`crop_${String(n).padStart(3,`0`)}.png`,i);let e=Date.now()-o;this.log(`Box ${n+1}/${r}: [x:${t.x}, y:${t.y}, w:${t.width}, h:${t.height}]
	 → "${l}" (processed in ${e}ms)
`)}return{text:l,box:t,confidence:u}}catch(e){let t=e instanceof Error?e:Error(String(e));return console.error(`Error processing box ${n+1}: ${t.message}`,t.stack),null}}async recognizeTextViaContext(e,t,n){let{preprocessImage:r}=await Promise.resolve().then(()=>If),{decodeResults:i}=await Promise.resolve().then(()=>Df),{imageTensor:a,tensorWidth:o,tensorHeight:s}=await r(e,t.options.imageHeight??48,t.engine===`opencv`?t.platform.imageProcessor:void 0,t.platform.canvas.createProcessor.bind(t.platform.canvas)),c;try{return c=new t.platform.ort.Tensor(`float32`,a,[1,3,s,o]),i(await t.runInference(c),n??t.options.charactersDictionary??[],o,this.debugging.verbose,t.options.spaceRecovery??!1)}finally{c?.dispose()}}isValidBox(e,t){return e.width<=0||e.height<=0?(console.warn(`Skipping invalid box ${t+1}: w=${e.width}, h=${e.height}`),!1):!0}async runInference(e){let t=this.options.mainThreadYieldMs??0;t>0&&await new Promise(e=>setTimeout(e,t));let n={x:e},r=await this.session.run(n),i=Object.keys(r)[0],a=i?r[i]:void 0;if(!a)throw Error(`Recognition output tensor '${i}' not found. Available keys: ${Object.keys(r)}`);return a}};function Zf(e,t){return{x:Math.round(e.x*t),y:Math.round(e.y*t),width:Math.max(1,Math.round(e.width*t)),height:Math.max(1,Math.round(e.height*t))}}function Qf(e,t=typeof window<`u`&&!Sf()){return t?{mainThreadYieldMs:10,...e}:e}var $f=class extends Xf{constructor(e,t={},n={}){super(new bf,e,Qf(t),n,`canvas-native`)}};let ep={graphOptimizationLevel:`all`};var tp=class extends of{constructor(e){super(new bf,e),(this.options.session===void 0||Object.keys(this.options.session).length===0)&&(this.options.session=ep)}async initSessions(){throw Error(`Initialization is handled proactively in PaddleOcrService. Call initialize() instead.`)}async _loadResource(e,t){if(e instanceof ArrayBuffer)return this.log(`Loading resource from ArrayBuffer`),e;let n=typeof e==`string`?e:t;return this.log(`Fetching resource from URL: ${n}`),jd(n)}async _resolveSessionExecutionProviders(){let e=this.options.session??{};if(e.executionProviders&&e.executionProviders.length>0){this.log(`Using user-provided executionProviders: ${JSON.stringify(e.executionProviders)}`);return}let t=await Tf();this.options.session={...e,executionProviders:t},this.log(`Resolved executionProviders: ${JSON.stringify(t)}`)}async _createSession(e){return lf(a,e,this.options.session,e=>console.warn(`[PaddleOcrService] ${e}`),e=>this.options.session=e)}async initialize(){try{this.log(`Initializing PaddleOcrService (Web)...`),await this._resolveSessionExecutionProviders();let[e,t,n]=await Promise.all([this._loadResource(this.options.model?.detection,i.detection),this._loadResource(this.options.model?.recognition,i.recognition),this._loadResource(this.options.model?.charactersDictionary,i.charactersDictionary)]),[r,a]=await Promise.all([this._createSession(new Uint8Array(e)),this._createSession(new Uint8Array(t))]);this.detectionSession=r,this.recognitionSession=a,this.options.model&&(this.options.model.detection=e),this.options.model&&(this.options.model.recognition=t),this.log(`Detection ONNX model loaded successfully
	input: ${r.inputNames}
	output: ${r.outputNames}`),this.log(`Recognition ONNX model loaded successfully
	input: ${a.inputNames}
	output: ${a.outputNames}`);let o=Md(n);if(o.length===0)throw Error(`Character dictionary is empty or could not be loaded.`);this.options.model&&(this.options.model.charactersDictionary=n),this.options.recognition&&(this.options.recognition.charactersDictionary=o),this.log(`Character dictionary loaded with ${o.length} entries.`),this.detector=new Ef(r,this.options.detection,this.options.debugging),this.recognitor=new $f(a,this.options.recognition,this.options.debugging),this.options.model&&(this.options.model.detection=void 0),this.options.model&&(this.options.model.recognition=void 0)}catch(e){throw console.error(`Failed to initialize PaddleOcrService Web:`,e),e}}isInitialized(){return this.detectionSession!==null&&this.recognitionSession!==null}async changeDetectionModel(e){this.log(`Changing detection model...`);let t=await this._loadResource(e,i.detection);await this.detectionSession?.release(),this.detectionSession=await this._createSession(new Uint8Array(t)),this.detector=new Ef(this.detectionSession,this.options.detection,this.options.debugging),this.options.model&&(this.options.model.detection=t),this.log(`Detection model changed successfully.`)}async changeRecognitionModel(e){this.log(`Changing recognition model...`);let t=await this._loadResource(e,i.recognition);await this.recognitionSession?.release(),this.recognitionSession=await this._createSession(new Uint8Array(t)),this.recognitor=new $f(this.recognitionSession,this.options.recognition,this.options.debugging),this.options.model&&(this.options.model.recognition=t),this.log(`Recognition model changed successfully.`)}async changeTextDictionary(e){this.log(`Changing text dictionary...`);let t=await this._loadResource(e,i.charactersDictionary),n=Md(t);if(n.length===0)throw Error(`Character dictionary is empty or could not be loaded.`);this.options.model&&(this.options.model.charactersDictionary=t),this.options.recognition&&(this.options.recognition.charactersDictionary=n),this.log(`Character dictionary changed successfully with ${n.length} entries.`)}async recognize(e,t){return super.recognize(e,t)}async destroy(){await this.detectionSession?.release(),await this.recognitionSession?.release(),this.detectionSession=null,this.recognitionSession=null,this.detector=null,this.recognitor=null}};let np=null;const rp=new Map,ip=()=>np||(np=new Worker(new URL(`/assets/opencv.worker-9ZOgcbJy.js`,``+import.meta.url),{type:`module`}),np.onmessage=e=>{let t=rp.get(e.data.requestId);if(t){if(rp.delete(e.data.requestId),e.data.type===`error`){t.reject(Error(e.data.message));return}t.resolve(new ImageData(new Uint8ClampedArray(e.data.pixels),t.width,t.height))}},np.onerror=e=>{let t=Error(e.message||`OpenCV worker crashed.`);for(let e of rp.values())e.reject(t);rp.clear(),np?.terminate(),np=null},np),ap=(e,t,n,r)=>new Promise((i,a)=>{let o=crypto.randomUUID();rp.set(o,{width:e.width,height:e.height,resolve:i,reject:a});let s=e.data.slice().buffer,c=t.slice().buffer;ip().postMessage({requestId:o,pixels:s,mask:c,width:e.width,height:e.height,method:n,radius:r},[s,c])}),op=e=>new ImageData(new Uint8ClampedArray(e.data),e.width,e.height),sp=e=>e*4,cp=(e,t,n)=>{let r=new Uint16Array(e.length),i=new Uint8Array(e.length),a=new Int32Array(e.length),o=0,s=0,c=[-t,-1,1,t];for(let o=0;o<n;o+=1)for(let n=0;n<t;n+=1){let l=o*t+n;if(e[l])for(let o of c){let c=l+o,u=c%t;if(c>=0&&c<e.length&&Math.abs(u-n)<=1&&!e[c]){a[s]=l,s+=1,i[l]=1,r[l]=1;break}}}for(;o<s;){let n=a[o];o+=1;let l=n%t,u=r[n]+1;for(let o of c){let c=n+o;if(c<0||c>=e.length||i[c]||!e[c])continue;let d=c%t;Math.abs(d-l)>1||(i[c]=1,r[c]=u,a[s]=c,s+=1)}}return Array.from(a.slice(0,s)).sort((e,t)=>r[e]-r[t]||e-t)},lp=(e,t,n)=>{let r=op(e),i=new Uint8Array(t),a=cp(t,e.width,e.height),o=Math.max(2,Math.min(8,n));for(let t of a){let n=t%e.width,a=Math.floor(t/e.width),s=[0,0,0],c=0;for(let t=-o;t<=o;t+=1)for(let l=-o;l<=o;l+=1){let u=n+l,d=a+t;if(u<0||u>=e.width||d<0||d>=e.height)continue;let f=d*e.width+u;if(i[f])continue;let p=l*l+t*t;if(p===0||p>o**2)continue;let m=1/p,h=sp(f);s[0]+=r.data[h]*m,s[1]+=r.data[h+1]*m,s[2]+=r.data[h+2]*m,c+=m}if(c>0){let e=sp(t);r.data[e]=s[0]/c,r.data[e+1]=s[1]/c,r.data[e+2]=s[2]/c}i[t]=0}return r},up=(e,t,n,r,i)=>{let a=[],o=Math.max(1,Math.floor(Math.sqrt(t*n/5e3)));for(let i=r;i<n-r;i+=o)for(let n=r;n<t-r;n+=o){let o=i*t+n;if(e[o])continue;let s=!0;for(let a=-r;a<=r&&s;a+=1)for(let o=-r;o<=r;o+=1)if(e[(i+a)*t+n+o]){s=!1;break}s&&a.push(o)}if(a.length<=i)return a;let s=[],c=a.length/i;for(let e=0;e<i;e+=1)s.push(a[Math.floor(e*c)]);return s},dp=(e,t)=>{let n=op(e),r=new Uint8Array(t),i=t.reduce((e,t)=>e+ +!!t,0),a=i>12e3?1:2,o=i>12e3?40:96,s=up(t,e.width,e.height,a,o);if(!s.length)return lp(e,t,5);for(let i of cp(t,e.width,e.height)){let t=i%e.width,o=Math.floor(i/e.width),c=s[0],l=1/0;for(let i of s){let s=i%e.width,u=Math.floor(i/e.width),d=0,f=0;for(let i=-a;i<=a;i+=1)for(let c=-a;c<=a;c+=1){let a=t+c,l=o+i;if(a<0||a>=e.width||l<0||l>=e.height)continue;let p=l*e.width+a;if(r[p])continue;let m=(u+i)*e.width+s+c,h=sp(p),g=sp(m);for(let t=0;t<3;t+=1){let r=n.data[h+t]-e.data[g+t];d+=r*r}f+=1}f&&(d/=f,d+=.015*((s-t)**2+(u-o)**2),d<l&&(l=d,c=i))}let u=sp(i),d=sp(c);n.data[u]=e.data[d],n.data[u+1]=e.data[d+1],n.data[u+2]=e.data[d+2],r[i]=0}return n},fp=async(e,t,n,r)=>{if(n===`patch`)return dp(e,t);try{return await ap(e,t,n,r)??lp(e,t,r)}catch(i){return console.warn(`OpenCV ${n} inpainting failed; using fallback.`,i),lp(e,t,r)}};let pp=null;const mp=new Map,hp=()=>pp||(pp=new Worker(new URL(`/assets/inpaint.worker-C7rsHl2f.js`,``+import.meta.url),{type:`module`}),pp.onmessage=e=>{let t=mp.get(e.data.requestId);if(t){if(mp.delete(e.data.requestId),e.data.type===`error`){t.reject(Error(e.data.message));return}t.resolve({image:new ImageData(new Uint8ClampedArray(e.data.pixels),e.data.width,e.data.height),provider:e.data.provider})}},pp.onerror=e=>{let t=Error(e.message||`The inpainting worker crashed.`);for(let e of mp.values())e.reject(t);mp.clear(),pp?.terminate(),pp=null},pp),gp=(e,t,n)=>new Promise((r,i)=>{let a=crypto.randomUUID();mp.set(a,{resolve:r,reject:i});let o=e.data.slice().buffer,s=t.slice().buffer;hp().postMessage({requestId:a,model:n,pixels:o,mask:s,width:e.width,height:e.height},[o,s])}),_p=e=>Math.max(8,e*.72),vp=(e,t,n)=>Math.max(t,Math.min(n,e)),yp=(e,t,n)=>(t*n+e)*4,bp=(e,t)=>e.length?(e.sort((e,t)=>e-t),e[Math.floor((e.length-1)*t)]):0,xp=(e,t)=>{let n=e.map((e,n)=>[...e,t[n]]);for(let r=0;r<3;r+=1){let i=r;for(let e=r+1;e<3;e+=1)Math.abs(n[e][r])>Math.abs(n[i][r])&&(i=e);[n[r],n[i]]=[n[i],n[r]];let a=n[r][r];if(Math.abs(a)<1e-8)return[0,0,t[0]/Math.max(1,e[0][0])];for(let e=r;e<4;e+=1)n[r][e]/=a;for(let e=0;e<3;e+=1){if(e===r)continue;let t=n[e][r];for(let i=r;i<4;i+=1)n[e][i]-=t*n[r][i]}}return[n[0][3],n[1][3],n[2][3]]},Sp=e=>{let t=[[0,0,0],[0,0,0],[0,0,0]],n=[[0,0,0],[0,0,0],[0,0,0]];for(let[r,i,a,o,s]of e){let e=[r,i,1];for(let r=0;r<3;r+=1){for(let n=0;n<3;n+=1)t[r][n]+=e[r]*e[n];n[0][r]+=e[r]*a,n[1][r]+=e[r]*o,n[2][r]+=e[r]*s}}return n.map(e=>xp(t.map(e=>[...e]),e))},Cp=(e,t,n)=>e.map(e=>vp(e[0]*t+e[1]*n+e[2],0,255)),wp=e=>{let t=e/255;return t<=.04045?t/12.92:((t+.055)/1.055)**2.4},Tp=e=>{let t=wp(e[0]),n=wp(e[1]),r=wp(e[2]),i=(t*.4124+n*.3576+r*.1805)/.95047,a=t*.2126+n*.7152+r*.0722,o=(t*.0193+n*.1192+r*.9505)/1.08883,s=e=>e>.008856?Math.cbrt(e):7.787*e+16/116,c=s(i),l=s(a),u=s(o);return[116*l-16,500*(c-l),200*(l-u)]},Ep=(e,t)=>{let n=Tp(e),r=Tp(t),i=n[0]-r[0],a=n[1]-r[1],o=n[2]-r[2];return Math.sqrt(i*i+a*a+o*o)},Dp=(e,t,n)=>Cp(e.planes,(t-e.bounds.x)/Math.max(1,e.bounds.width),(n-e.bounds.y)/Math.max(1,e.bounds.height)),Op=(e,t,n)=>e<n.x||e>n.x+n.width||t<n.y||t>n.y+n.height,kp=(e,t,n)=>{let r=e<n.x?n.x-e:e>n.x+n.width?e-(n.x+n.width):0,i=t<n.y?n.y-t:t>n.y+n.height?t-(n.y+n.height):0;return Math.max(r,i)},Ap=e=>Math.max(4,Math.min(16,Math.round(e*.1))),jp=(e,t)=>{let n=Math.max(8,Math.round(t.height*.75)),r=vp(Math.floor(t.x-n),0,e.width-1),i=vp(Math.floor(t.y-n),0,e.height-1),a=vp(Math.ceil(t.x+t.width+n),r+1,e.width),o=vp(Math.ceil(t.y+t.height+n),i+1,e.height),s={x:r,y:i,width:a-r,height:o-i},c=Math.max(2,Math.round(t.height*.12)),l=[],u=Math.max(1,Math.floor(Math.min(s.width,s.height)/96));for(let n=i;n<o;n+=u)for(let o=r;o<a;o+=u){if(o>=t.x-c&&o<=t.x+t.width+c&&n>=t.y-c&&n<=t.y+t.height+c)continue;let a=yp(o,n,e.width);l.push([(o-r)/Math.max(1,s.width),(n-i)/Math.max(1,s.height),e.data[a],e.data[a+1],e.data[a+2]])}let d=Sp(l),f=l.map(e=>{let t=Cp(d,e[0],e[1]);return{sample:e,error:(e[2]-t[0])**2+(e[3]-t[1])**2+(e[4]-t[2])**2}}).sort((e,t)=>e.error-t.error),p=f.slice(0,Math.max(6,Math.ceil(f.length*.78))).map(e=>e.sample);d=Sp(p);let m=[0,1,2].map(e=>p.map(t=>t[e+2]).sort((e,t)=>e-t)).map(e=>e[Math.floor(e.length/2)]??255),h=0,g=0;for(let e of p){let t=Cp(d,e[0],e[1]);for(let n=0;n<3;n+=1)h+=(e[n+2]-t[n])**2,g+=(e[n+2]-m[n])**2}let _=0,v=0;for(let t=i+u;t<o;t+=u)for(let n=r+u;n<a;n+=u){let r=yp(n,t,e.width),i=yp(n-u,t,e.width),a=yp(n,t-u,e.width),o=Math.abs(e.data[r]-e.data[i])+Math.abs(e.data[r+1]-e.data[i+1])+Math.abs(e.data[r+2]-e.data[i+2]),s=Math.abs(e.data[r]-e.data[a])+Math.abs(e.data[r+1]-e.data[a+1])+Math.abs(e.data[r+2]-e.data[a+2]);(o>65||s>65)&&(_+=1),v+=1}let y=Math.max(1,p.length*3),b=h/y,x=g/y;return{bounds:s,planes:d,flatColor:m,fitError:b,variance:x,localVariance:x,localFitError:b,edgeDensity:_/Math.max(1,v),ringMedian:m,ringSpread:0}},Mp=(e,t,n,r,i)=>{if(r<=0)return new Uint8Array(e);let a=new Uint8Array(e.length);for(let o=0;o<n;o+=1)for(let s=0;s<t;s+=1){let c=i===`erode`?255:0;outer:for(let a=-r;a<=r;a+=1)for(let l=-r;l<=r;l+=1){if(l*l+a*a>r*r)continue;let u=s+l,d=o+a,f=u>=0&&u<t&&d>=0&&d<n?e[d*t+u]:0;if(i===`dilate`&&f){c=255;break outer}if(i===`erode`&&!f){c=0;break outer}}a[o*t+s]=c}return a},Np=(e,t,n,r)=>{let i=new Map;for(let a=0;a<t.height;a+=1)for(let o=0;o<t.width;o+=1){let s=a*t.width+o;if(!n[s])continue;let c=yp(t.x+o,t.y+a,e.width),l=e.data[c],u=e.data[c+1],d=e.data[c+2],f=(l>>5)*64+(u>>5)*8+(d>>5),p=i.get(f)??{count:0,residual:0,color:[0,0,0]};p.count+=1,p.residual+=r[s],p.color[0]+=l,p.color[1]+=u,p.color[2]+=d,i.set(f,p)}let a=[...i.entries()].sort(([,e],[,t])=>t.count*(t.residual/t.count)-e.count*(e.residual/e.count)),o=a.reduce((e,[,t])=>e+t.count,0),s=new Set,c=0;for(let[e,t]of a.slice(0,4))if(s.add(e),c+=t.count,c>=o*.82)break;if(o<20||s.size===0)return n;let l=new Uint8Array(n.length);for(let r=0;r<t.height;r+=1)for(let i=0;i<t.width;i+=1){let a=r*t.width+i;if(!n[a])continue;let o=yp(t.x+i,t.y+r,e.width),c=(e.data[o]>>5)*64+(e.data[o+1]>>5)*8+(e.data[o+2]>>5);s.has(c)&&(l[a]=255)}return l},Pp=(e,t,n,r,i)=>{let a=new Uint8Array(e),o=new Uint16Array(e.length),s=new Int32Array(e.length),c=0,l=0;for(let t=0;t<e.length;t+=1)e[t]&&(s[l]=t,l+=1);let u=[-n-1,-n,-n+1,-1,1,n-1,n,n+1];for(;c<l;){let d=s[c];c+=1;let f=d%n,p=Math.floor(d/n),m=o[d]+1;if(!(m>i))for(let i of u){let c=d+i;if(c<0||c>=e.length||a[c])continue;let u=c%n,h=Math.floor(c/n);Math.abs(u-f)>1||Math.abs(h-p)>1||t[c]<r||(a[c]=255,o[c]=m,s[l]=c,l+=1)}}return a},Fp=(e,t,n,r)=>{let i=[];for(let a=0;a<t.height;a+=1)for(let o=0;o<t.width;o+=1){let s=a*t.width+o;if(!n[s])continue;let c=yp(t.x+o,t.y+a,e.width);i.push({residual:r[s],color:[e.data[c],e.data[c+1],e.data[c+2]]})}i.sort((e,t)=>t.residual-e.residual);let a=i.slice(0,Math.max(1,Math.ceil(i.length*.45)));return`#${[0,1,2].map(e=>a.reduce((t,n)=>t+n.color[e],0)/a.length).map(e=>vp(Math.round(e),0,255).toString(16).padStart(2,`0`)).join(``)}`},Ip=(e,t,n)=>{let r=jp(e,t.bounds),{bounds:i}=r,a=i.width*i.height,o=new Float32Array(a),s=[],c=[],l=Math.max(2,Math.round(t.bounds.height*.28)),u=Ap(t.bounds.height);for(let n=0;n<i.height;n+=1)for(let a=0;a<i.width;a+=1){let l=i.x+a,d=i.y+n,f=yp(l,d,e.width),p=Dp(r,l,d),m=[e.data[f],e.data[f+1],e.data[f+2]],h=Ep(m,p);o[n*i.width+a]=h;let g=kp(l,d,t.bounds);Op(l,d,t.bounds)&&g<=u&&(s.push(h),c.push([(l-i.x)/Math.max(1,i.width),(d-i.y)/Math.max(1,i.height),m[0],m[1],m[2]]))}if(c.length>=6){let e=[0,1,2].map(e=>c.map(t=>t[e+2]).sort((e,t)=>e-t)).map(e=>e[Math.floor(e.length/2)]??255),t=0,n=0;for(let i of c){let a=Cp(r.planes,i[0],i[1]);for(let r=0;r<3;r+=1)t+=(i[r+2]-e[r])**2,n+=(i[r+2]-a[r])**2}let i=Math.max(1,c.length*3);r.localVariance=t/i,r.localFitError=n/i,r.ringMedian=e,r.ringSpread=bp(c.map(t=>Ep([t[2],t[3],t[4]],e)),.75),r.localVariance<105&&(r.flatColor=e)}let d=bp(s,.9),f=bp(s,.75),p=n.maskThreshold*.42,m=Math.max(p,d+5),h=Math.max(4,f+2,m*.42),g=new Uint8Array(a),_=Math.max(1,t.bounds.width*t.bounds.height),v=0;for(let e=0;e<i.height;e+=1)for(let n=0;n<i.width;n+=1){let r=i.x+n,a=i.y+e,s=r>=t.bounds.x-l&&r<=t.bounds.x+t.bounds.width+l&&a>=t.bounds.y-l&&a<=t.bounds.y+t.bounds.height+l,c=e*i.width+n;s&&o[c]>=m&&(g[c]=255,v+=1)}if(v<_*.02){let n=Math.max(p,16);for(let a=0;a<i.height;a+=1)for(let s=0;s<i.width;s+=1){let c=i.x+s,u=i.y+a,d=c>=t.bounds.x-l&&c<=t.bounds.x+t.bounds.width+l&&u>=t.bounds.y-l&&u<=t.bounds.y+t.bounds.height+l,f=a*i.width+s;if(!d||g[f])continue;let p=yp(c,u,e.width),m=[e.data[p],e.data[p+1],e.data[p+2]];(o[f]>=n||Ep(m,r.flatColor)>=n)&&(g[f]=255)}}g=Np(e,i,g,o),g=Mp(Mp(g,i.width,i.height,1,`dilate`),i.width,i.height,1,`erode`);let y=Math.max(2,Math.round(t.bounds.height*.32)),b=Pp(g,o,i.width,h,y),x=+(t.bounds.height>=28),S=Mp(b,i.width,i.height,Math.max(n.maskDilation,x),`dilate`),C=new Uint8Array(a),w=new Uint8ClampedArray(a),T=0,E=0;for(let e=0;e<a;e+=1)if(g[e]&&(T+=1),b[e]&&!g[e]&&(C[e]=255),S[e]){E+=1;let t=(o[e]-h)/Math.max(1,m-h);w[e]=Math.round(255*vp(.82+t*.18,.82,1))}let D=T/_,O=d/Math.max(1,m),k=vp(t.confidence*(D>.025&&D<.78?1:.72)*(1-Math.min(.35,O*.2)),.2,.99);return{detection:t,bounds:i,width:i.width,height:i.height,coreMask:g,effectMask:C,removalMask:S,softMask:w,model:r,textColor:Fp(e,i,g,o),confidence:E?k:0}},Lp=e=>{if(!e.length)return 0;let t=[...e].sort((e,t)=>e-t);return t[Math.floor((t.length-1)/2)]},Rp=(e,t,n)=>{let r=yp(t,n,e.width);return[e.data[r],e.data[r+1],e.data[r+2]]},zp=(e,t)=>{let{bounds:n,removalMask:r,width:i,height:a,model:o}=t,s=[];for(let t=0;t<a;t+=1)for(let a=0;a<i;a+=1)r[t*i+a]&&s.push(Rp(e,n.x+a,n.y+t));if(s.length<4)return!1;let c=o.ringMedian,l=o.ringSpread,u=[Lp(s.map(e=>e[0])),Lp(s.map(e=>e[1])),Lp(s.map(e=>e[2]))],d=s.reduce((e,t)=>e+Ep(t,c),0)/s.length,f=Ep(u,c);return l>=14||f>Math.max(7,l*2.2)||d>Math.max(7,l*2.2)},Bp=`lama`,Vp=(e,t,n)=>Math.max(t,Math.min(n,e)),Hp=(e,t,n)=>(t*n+e)*4,Up=new Set([`migan`,`lama`]),Wp=(e,t)=>{if(e!==`auto`)return e;let{model:n}=t;return n.localVariance<105||n.variance<105&&n.fitError<95?`flat`:n.fitError<185&&n.edgeDensity<.09?`gradient`:Bp},Gp=(e,t)=>{let n=new Uint8ClampedArray(t.width*t.height*4);for(let r=0;r<t.height;r+=1){let i=Hp(t.x,t.y+r,e.width),a=i+t.width*4;n.set(e.data.subarray(i,a),r*t.width*4)}return new ImageData(n,t.width,t.height)},Kp=(e,t)=>Gp(e,t.bounds),qp=(e,t)=>{let{bounds:n}=t,r=Vp(Math.round(t.detection.bounds.height*1.25),24,192),i=Vp(n.x-r,0,e.width-1),a=Vp(n.y-r,0,e.height-1),o=Vp(n.x+n.width+r,i+1,e.width),s=Vp(n.y+n.height+r,a+1,e.height),c={x:i,y:a,width:o-i,height:s-a},l=Gp(e,c),u=new Uint8Array(c.width*c.height),d=n.x-c.x,f=n.y-c.y;for(let e=0;e<n.height;e+=1)for(let r=0;r<n.width;r+=1){if(!t.removalMask[e*n.width+r])continue;let i=(e+f)*c.width+(r+d);u[i]=255}return{bounds:c,crop:l,mask:u}},Jp=(e,t,n)=>{for(let r=0;r<n.height;r+=1)for(let i=0;i<n.width;i+=1){let a=r*n.width+i;if(!n.removalMask[a])continue;let o=Hp(n.bounds.x+i,n.bounds.y+r,e.width);e.data[o]=t.data[o],e.data[o+1]=t.data[o+1],e.data[o+2]=t.data[o+2],e.data[o+3]=t.data[o+3]}},Yp=(e,t,n)=>{for(let r=0;r<t.height;r+=1)for(let i=0;i<t.width;i+=1){let a=r*t.width+i;if(!t.removalMask[a])continue;let o=t.bounds.x+i,s=t.bounds.y+r,c=n===`flat`?t.model.flatColor:Dp(t.model,o,s),l=Hp(o,s,e.width);e.data[l]=c[0],e.data[l+1]=c[1],e.data[l+2]=c[2]}},Xp=(e,t,n,r)=>{let i=new Float32Array(e.length);if(r<=0){for(let t=0;t<e.length;t+=1)i[t]=+!!e[t];return i}let a=new Int32Array(e.length).fill(-1),o=new Int32Array(e.length),s=0,c=0,l=[-1,1];for(let r=0;r<n;r+=1)for(let i=0;i<t;i+=1){let s=r*t+i;if(!e[s])continue;let u=r===0||r===n-1||i===0||i===t-1||!e[s-t]||!e[s+t];if(!u){for(let t of l)if(!e[s+t]){u=!0;break}}u&&(a[s]=1,o[c]=s,c+=1)}let u=[-t,t,-1,1];for(;s<c;){let n=o[s];s+=1;let r=n%t,i=a[n]+1;for(let s of u){let l=n+s;l<0||l>=e.length||(s!==-1&&s!==1||Math.abs(l%t-r)===1)&&(!e[l]||a[l]!==-1||(a[l]=i,o[c]=l,c+=1))}}let d=r+1;for(let t=0;t<e.length;t+=1){if(!e[t]){i[t]=0;continue}let n=a[t]<0?d:a[t];i[t]=Vp(n/d,0,1)}return i},Zp=(e,t,n,r,i)=>{for(let a=0;a<n.height;a+=1)for(let o=0;o<n.width;o+=1){let s=a*n.width+o;if(!r[s])continue;let c=i[s];if(c<=0)continue;let l=s*4,u=Hp(n.x+o,n.y+a,e.width),d=1-c;e.data[u]=Math.round(e.data[u]*d+t.data[l]*c),e.data[u+1]=Math.round(e.data[u+1]*d+t.data[l+1]*c),e.data[u+2]=Math.round(e.data[u+2]*d+t.data[l+2]*c)}},Qp=(e,t)=>{let{model:n}=e;return t===`flat`?Vp(1-n.variance/950,.45,.99):t===`gradient`?Vp(1-n.fitError/1100,.42,.98):t===`lama`?Vp(.94-n.edgeDensity*.4,.6,.94):t===`migan`?Vp(.9-n.edgeDensity*.45,.55,.9):t===`navier-stokes`?Vp(.82-n.edgeDensity*.8,.45,.82):t===`patch`?Vp(.79-n.edgeDensity*.45,.48,.79):Vp(.78-n.edgeDensity*.55,.45,.78)},$p=e=>{let{model:t}=e;return t.localVariance<105||t.variance<105&&t.fitError<95?`flat`:t.fitError<185&&t.edgeDensity<.09?`gradient`:`complex`},em=(e,t,n)=>{let{detection:r}=e,{bounds:i}=r;return{id:`text-${n}-${Math.round(i.x)}-${Math.round(i.y)}`,originalText:r.text,text:r.text,bounds:{...i},polygon:[{x:i.x,y:i.y},{x:i.x+i.width,y:i.y},{x:i.x+i.width,y:i.y+i.height},{x:i.x,y:i.y+i.height}],rotation:0,typography:{fontFamily:`Arial`,fontSize:_p(i.height),fontWeight:700,color:e.textColor,strokeColor:`#000000`,strokeWidth:0,letterSpacing:0,lineHeight:1,alignment:`left`},effects:{opacity:1},processing:{recognitionConfidence:r.confidence,maskConfidence:e.confidence,reconstructionConfidence:Qp(e,t),reconstructionMethod:t,backgroundType:$p(e)}}},tm=e=>Vp(Math.round(e.detection.bounds.height*.06),1,3),nm=async(e,t,n)=>{let r=new ImageData(new Uint8ClampedArray(e.data),e.width,e.height),i=new Uint8Array(e.width*e.height),a=performance.now(),o=t.map(t=>Ip(e,t,n)),s=performance.now()-a,c=o.map(e=>Wp(n.method,e));for(let t of o)for(let n=0;n<t.height;n+=1)for(let r=0;r<t.width;r+=1){if(!t.removalMask[n*t.width+r])continue;let a=t.bounds.x+r,o=t.bounds.y+n;i[o*e.width+a]=255}let l=null,u=null,d=performance.now();for(let t=0;t<o.length;t+=1){let i=o[t],a=c[t];if(a===`flat`||a===`gradient`){if(Yp(r,i,a),n.method===`auto`&&zp(r,i))Jp(r,e,i),a=Bp,c[t]=a;else continue}let s=Vp(Math.round(i.detection.bounds.height*.12),2,12),d=tm(i);if(Up.has(a)){let e=qp(r,i),t;try{let n=await gp(e.crop,e.mask,a);t=n.image,l=a,u=n.provider}catch(n){console.warn(`Neural inpaint (${a}) failed; falling back to Telea.`,n),t=await fp(e.crop,e.mask,`telea`,s)}let n=Xp(e.mask,e.bounds.width,e.bounds.height,d);Zp(r,t,e.bounds,e.mask,n);continue}let f=Kp(r,i),p=await fp(f,i.removalMask,a,s),m=Xp(i.removalMask,i.width,i.height,d);Zp(r,p,i.bounds,i.removalMask,m)}let f=performance.now()-d,p=new Uint8ClampedArray(e.width*e.height*4),m=0;for(let e=0;e<i.length;e+=1){let t=i[e],n=e*4;p[n]=t,p[n+1]=t,p[n+2]=t,p[n+3]=t,t&&(m+=1)}return{clean:r,mask:new ImageData(p,e.width,e.height),layers:o.map((e,t)=>em(e,c[t],t)),maskedPixels:m,segmentationMs:s,inpaintMs:f,inpaintModel:l,inpaintProvider:u}},rm=(e,t,n)=>Math.max(t,Math.min(n,e)),im=(e,t,n)=>{let r=Math.max(16,Math.min(e.width*.3,e.height*1.35)),i=Math.max(12,e.height*.8),a=rm(Math.floor(e.x-r),0,t-1),o=rm(Math.floor(e.y-i),0,n-1),s=rm(Math.ceil(e.x+e.width+r),a+1,t),c=rm(Math.ceil(e.y+e.height+i),o+1,n);return{x:a,y:o,width:s-a,height:c-o}},am=(e,t)=>Math.max(0,Math.min(e.x+e.width,t.x+t.width)-Math.max(e.x,t.x))*Math.max(0,Math.min(e.y+e.height,t.y+t.height)-Math.max(e.y,t.y)),om=(e,t,n)=>e.map(e=>({...e,bounds:{...e.bounds,x:e.bounds.x+t.x,y:e.bounds.y+t.y}})).filter(e=>{let t=e.bounds.x+e.bounds.width/2,r=e.bounds.y+e.bounds.height/2,i=t>=n.x&&t<=n.x+n.width&&r>=n.y&&r<=n.y+n.height,a=am(e.bounds,n)/Math.max(1,e.bounds.width*e.bounds.height);return i||a>=.22}),sm=`/models/ocr/ppocr-v6-tiny-v1`;let cm=`wasm`,lm=null;const um=()=>(lm??=(async()=>{cm=await wf()?`webgpu`:`wasm`;let e=new tp({model:{detection:`${sm}/detection.ort`,recognition:`${sm}/recognition.ort`,charactersDictionary:`${sm}/dictionary.txt`},detection:{maxSideLength:`auto`,minimumAreaThreshold:16,paddingHorizontal:.15,paddingVertical:.12},recognition:{charactersDictionary:[],minimumConfidence:.35,strategy:`per-box`,maxCropSourceSideLength:3e3,spaceRecovery:!0},processing:{engine:`canvas-native`}});return await e.initialize(),e})(),lm),dm=(e,t=[])=>{self.postMessage(e,{transfer:t})},fm=(e,t,n)=>{dm({type:`progress`,requestId:e,stage:t,progress:n})},pm=async e=>{let t=new OffscreenCanvas(e.width,e.height),n=t.getContext(`2d`);if(!n)throw Error(`Canvas 2D is unavailable in this browser.`);return n.putImageData(e,0,0),(await t.convertToBlob({type:`image/png`})).arrayBuffer()},mm=async(e,t)=>{let n=await createImageBitmap(new Blob([e],{type:t}),{imageOrientation:`from-image`}),r=new OffscreenCanvas(n.width,n.height),i=r.getContext(`2d`,{willReadFrequently:!0});if(!i)throw Error(`Canvas 2D is unavailable in this browser.`);return i.drawImage(n,0,0),n.close(),{canvas:r,imageData:i.getImageData(0,0,r.width,r.height)}},hm=(e,t,n)=>{let r=Math.min(3,2e3/Math.max(t.width,t.height)),i=n<70?Math.max(1,r):n<140?Math.max(1,Math.min(2,r)):1,a=new OffscreenCanvas(Math.max(1,Math.round(t.width*i)),Math.max(1,Math.round(t.height*i))),o=a.getContext(`2d`);if(!o)throw Error(`Canvas 2D is unavailable in this browser.`);return o.imageSmoothingEnabled=!0,o.imageSmoothingQuality=`high`,o.drawImage(e,t.x,t.y,t.width,t.height,0,0,a.width,a.height),{canvas:a,scale:i}},gm=async e=>{let t=performance.now();fm(e.requestId,`loading-models`,.05);let[n,r]=await Promise.all([um(),mm(e.image,e.mimeType)]);fm(e.requestId,`ocr`,.15);let i=r.imageData,a=im(e.selection,i.width,i.height),o=hm(r.canvas,a,e.selection.height),s=performance.now(),c=await n.recognize(o.canvas,{flatten:!0,strategy:`per-box`,noCache:!0}),l=performance.now()-s,u=c.results.filter(e=>e.text.trim().length>0).map(e=>({text:e.text.trim(),confidence:e.confidence,bounds:{x:e.box.x/o.scale,y:e.box.y/o.scale,width:e.box.width/o.scale,height:e.box.height/o.scale}})),d=om(u,a,e.selection);if(!d.length)throw Error(`No text was found in this selection. Draw a slightly wider area around the text.`);fm(e.requestId,`masking`,.55);let f=performance.now(),p=await nm(i,d,e.options),m=performance.now()-f;fm(e.requestId,`reconstruction`,.82);let h=performance.now(),[g,_]=await Promise.all([pm(p.clean),pm(p.mask)]),v=performance.now()-h,y={width:i.width,height:i.height,cleanImage:g,maskImage:_,textLayers:p.layers,diagnostics:{model:`PP-OCRv6 tiny (ORT)`,provider:cm,inpaintModel:p.inpaintModel,inpaintProvider:p.inpaintProvider,ocrMs:l,maskMs:m,segmentationMs:p.segmentationMs,inpaintMs:p.inpaintMs,reconstructionMs:v,totalMs:performance.now()-t,maskedPixels:p.maskedPixels}};dm({type:`success`,requestId:e.requestId,result:y},[g,_])};self.onmessage=e=>{gm(e.data).catch(t=>{dm({type:`error`,requestId:e.data.requestId,message:t instanceof Error?t.message:`Image processing failed.`})})};