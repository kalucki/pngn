import type { Locale } from "./locales";

export const en = {
  "nav.primary": "Primary",
  "nav.howItWorks": "Credits",
  "nav.language": "Language",

  "title.home": "Change text on any image",
  "title.howItWorks": "Credits — pngn",
  "title.export": "Export — pngn",

  "flow.aria": "How to edit text on an image",
  "flow.upload": "Upload an image",
  "flow.select": "Select area",
  "flow.edit": "Edit text and export",

  "landing.heroLead":
    "Select the text in an image, rewrite it, and export a new image.",
  "landing.heroPrivacy": "Free, Safe & No Account Required.",
  "landing.dropTitle": "Drop an image here",
  "landing.dropHint": "or click to browse: PNG, JPEG, or WebP",
  "landing.privacy":
    "We are not storing uploaded images, they never leave your browser.",

  "app.newImage": "New image",
  "app.dragHint":
    "Drag a box around the text you want to change. Scroll to zoom.",
  "app.editSelected": "Edit selected text",
  "app.processing": "Processing…",
  "app.cancel": "Cancel",
  "app.selectAnother": "Select another area",
  "app.reconstruction": "Reconstruction",
  "app.methodAuto": "Auto",
  "app.methodAutoHintAria": "When to use Auto",
  "app.methodAutoHint":
    "Uses a simple color or gradient fill on flat backgrounds. Falls back to LaMa for photos and busy textures.",
  "app.methodMigan": "MI-GAN",
  "app.methodMiganHintAria": "When to use MI-GAN",
  "app.methodMiganHint":
    "Faster fill. Best for small text and simple or flat backgrounds.",
  "app.methodLama": "LaMa",
  "app.methodLamaHintAria": "When to use LaMa",
  "app.methodLamaHint":
    "Slower, more detailed fill. Use for large text, photos, or busy textures.",
  "app.maskThreshold": "Mask threshold",
  "app.maskThresholdHintAria": "When to change mask threshold",
  "app.maskThresholdHint":
    "Raise if leftover letter bits remain. Lower if too much around the text is erased.",
  "app.maskExpansion": "Mask expansion",
  "app.maskExpansionHintAria": "When to change mask expansion",
  "app.maskExpansionHint":
    "Grow the erased area around letters. Raise if a halo of the old text remains.",
  "app.processNewArea": "Process new area",
  "app.applySettingsHint": "Click the text layer to apply, or wait a moment.",
  "app.selectLayerToApply": "Select a text layer to apply.",
  "app.doneEditing": "Done editing?",
  "app.exportFormat": "Export format",
  "app.export": "Export",
  "app.exporting": "Exporting…",
  "layers.title": "Layers",
  "layers.aria": "Text layers",
  "layers.empty": "Select a text area to add a layer.",
  "layers.fallback": "Text {n}",
  "layers.background": "Background",
  "layers.exportPreview": "Export Preview",
  "layers.remove": "Remove text",

  "stage.waiting": "Waiting for an image",
  "stage.reading": "Reading image",
  "stage.loadingModels": "Loading models",
  "stage.ocr": "OCR",
  "stage.masking": "Masking",
  "stage.reconstruction": "Reconstruction",
  "stage.ready": "Ready to edit",
  "stage.failed": "Processing failed",

  "error.chooseImageType": "Choose a PNG, JPEG, or WebP image.",
  "error.decodeFailed": "This image could not be decoded by the browser.",
  "error.processingFailed": "Processing failed.",
  "error.exportFailed": "Export failed.",
  "error.canvasEncoding": "Canvas encoding failed.",
  "error.canvasUnavailable": "Canvas 2D is unavailable in this browser.",
  "error.workerCrashed": "The processing worker crashed.",
  "error.noTextFound":
    "No text was found in this selection. Draw a slightly wider area around the text.",
  "error.imageProcessingFailed": "Image processing failed.",
  "error.opencvFailed": "OpenCV inpainting failed.",

  "toolbar.hint": "Click text in the image to edit it. Scroll to zoom.",
  "toolbar.text": "Text",
  "toolbar.placeholder": "Type your new text…",
  "toolbar.font": "Font",
  "toolbar.fontError": "Could not load this font. Using a system font instead.",
  "toolbar.fontEmpty": "No fonts found",
  "toolbar.size": "Size",
  "toolbar.weight": "Weight",
  "toolbar.color": "Color",
  "toolbar.stroke": "Stroke",
  "toolbar.strokeWidth": "Stroke width",
  "toolbar.opacity": "Opacity",
  "fontGroup.system": "System",
  "fontGroup.sans": "Sans",
  "fontGroup.serif": "Serif",
  "fontGroup.display": "Display",
  "fontGroup.mono": "Monospace",
  "fontWeight.100": "Thin",
  "fontWeight.200": "Extra light",
  "fontWeight.300": "Light",
  "fontWeight.400": "Regular",
  "fontWeight.500": "Medium",
  "fontWeight.600": "Semibold",
  "fontWeight.700": "Bold",
  "fontWeight.800": "Extra bold",
  "fontWeight.900": "Black",

  "region.alt": "Choose the text region to edit",
  "region.selectText": "Select text",
  "zoom.reset": "Reset zoom to original size",

  "export.couldNot": "Could not export",
  "export.noPending":
    "No export in progress. Use Export after editing an image.",
  "export.back": "Back to editor",
  "export.downloadStarted": "Download started",
  "export.saving":
    "{filename} is saving to your computer. The file never left this browser.",
  "export.previewAlt": "Exported image preview",
  "export.downloadAgain": "Download again",

  "docs.kicker": "Kudos",
  "docs.title": "Thanks to the people who made this possible",
  "docs.intro":
    "p(e)ng(ui)n paints text out of your images using published inpainting research. This page is a thank-you to those authors.",
  "docs.privacy": "We don't save your images",
  "docs.privacy.p1":
    "There is no server-side processing. Finding the text, filling the background, editing, and export all happen in this browser.",
  "docs.privacy.p2": "The file you download is built locally.",
  "docs.models": "The models we use",
  "docs.models.p1":
    "When you select text, we remove those letters and fill the hole so the background looks intact. Two open inpainting libraries do that fill, entirely on your device.",
  "docs.migan": "MI-GAN",
  "docs.migan.authors":
    "Andranik Sargsyan, Shant Navasardyan, Xingqian Xu, and Humphrey Shi - Picsart AI Research",
  "docs.migan.p1":
    "We use MI-GAN as a compact inpainting model built to restore missing regions quickly, which is why it can run in the browser while you edit.",
  "docs.migan.github": "MI-GAN on GitHub",
  "docs.migan.paper": "Research paper",
  "docs.lama": "LaMa",
  "docs.lama.authors":
    "Roman Suvorov, Elizaveta Logacheva, Anton Mashikhin, Anastasia Remizova, Arsenii Ashukha, Aleksei Silvestrov, Naejin Kong, Harshith Goka, Kiwoong Park, and Victor Lempitsky - Samsung AI Center and Skoltech",
  "docs.lama.p1":
    "We use LaMa for filling larger, more textured holes. Like MI-GAN, it is downloaded to your device and run locally.",
  "docs.lama.github": "LaMa on GitHub",
  "docs.lama.paper": "Research paper",
  "docs.linkExternal": "opens in a new tab",
} as const;

export type MessageKey = keyof typeof en;
export type Messages = Record<MessageKey, string>;

const catalog = (messages: Messages): Messages => messages;

const es = catalog({
  "nav.primary": "Principal",
  "nav.howItWorks": "Créditos",
  "nav.language": "Idioma",

  "title.home": "Cambia el texto de cualquier imagen",
  "title.howItWorks": "Créditos — pngn",
  "title.export": "Exportar — pngn",

  "flow.aria": "Cómo editar texto en una imagen",
  "flow.upload": "Sube una imagen",
  "flow.select": "Selecciona el área",
  "flow.edit": "Edita el texto y exporta",

  "landing.heroLead":
    "Selecciona el texto de una imagen, reescríbelo y exporta una imagen nueva.",
  "landing.heroPrivacy": "Gratis, seguro y sin cuenta.",
  "landing.dropTitle": "Suelta una imagen aquí",
  "landing.dropHint": "o haz clic para elegir: PNG, JPEG o WebP",
  "landing.privacy":
    "No almacenamos las imágenes subidas; nunca salen de tu navegador.",

  "app.newImage": "Nueva imagen",
  "app.dragHint":
    "Arrastra un recuadro alrededor del texto que quieres cambiar. Desplázate para ampliar.",
  "app.editSelected": "Editar el texto seleccionado",
  "app.processing": "Procesando…",
  "app.cancel": "Cancelar",
  "app.selectAnother": "Seleccionar otra área",
  "app.reconstruction": "Reconstrucción",
  "app.methodAuto": "Auto",
  "app.methodAutoHintAria": "Cuándo usar Auto",
  "app.methodAutoHint":
    "Usa un relleno de color o degradado en fondos planos. Pasa a LaMa en fotos y texturas complejas.",
  "app.methodMigan": "MI-GAN",
  "app.methodMiganHintAria": "Cuándo usar MI-GAN",
  "app.methodMiganHint":
    "Relleno más rápido. Mejor para texto pequeño y fondos simples o planos.",
  "app.methodLama": "LaMa",
  "app.methodLamaHintAria": "Cuándo usar LaMa",
  "app.methodLamaHint":
    "Más lento y detallado. Úsalo en texto grande, fotos o texturas complejas.",
  "app.maskThreshold": "Umbral de máscara",
  "app.maskThresholdHintAria": "Cuándo cambiar el umbral de máscara",
  "app.maskThresholdHint":
    "Súbelo si quedan restos de letras. Bájalo si se borra demasiado alrededor del texto.",
  "app.maskExpansion": "Expansión de máscara",
  "app.maskExpansionHintAria": "Cuándo cambiar la expansión de máscara",
  "app.maskExpansionHint":
    "Amplía el área borrada alrededor de las letras. Súbela si queda un halo del texto anterior.",
  "app.processNewArea": "Procesar nueva área",
  "app.applySettingsHint":
    "Haz clic en la capa para aplicar, o espera un momento.",
  "app.selectLayerToApply": "Selecciona una capa de texto para aplicar.",
  "app.doneEditing": "¿Terminaste de editar?",
  "app.exportFormat": "Formato de exportación",
  "app.export": "Exportar",
  "app.exporting": "Exportando…",
  "layers.title": "Capas",
  "layers.aria": "Capas de texto",
  "layers.empty": "Selecciona un área de texto para añadir una capa.",
  "layers.fallback": "Texto {n}",
  "layers.background": "Fondo",
  "layers.exportPreview": "Vista previa de exportación",
  "layers.remove": "Quitar texto",

  "stage.waiting": "Esperando una imagen",
  "stage.reading": "Leyendo la imagen",
  "stage.loadingModels": "Cargando modelos",
  "stage.ocr": "OCR",
  "stage.masking": "Enmascarando",
  "stage.reconstruction": "Reconstrucción",
  "stage.ready": "Listo para editar",
  "stage.failed": "El procesamiento falló",

  "error.chooseImageType": "Elige una imagen PNG, JPEG o WebP.",
  "error.decodeFailed": "El navegador no pudo decodificar esta imagen.",
  "error.processingFailed": "El procesamiento falló.",
  "error.exportFailed": "La exportación falló.",
  "error.canvasEncoding": "No se pudo codificar el lienzo.",
  "error.canvasUnavailable": "Canvas 2D no está disponible en este navegador.",
  "error.workerCrashed": "El proceso de edición se detuvo.",
  "error.noTextFound":
    "No se encontró texto en esta selección. Dibuja un área un poco más amplia alrededor del texto.",
  "error.imageProcessingFailed": "El procesamiento de la imagen falló.",
  "error.opencvFailed": "El relleno de OpenCV falló.",

  "toolbar.hint":
    "Haz clic en el texto de la imagen para editarlo. Desplázate para ampliar.",
  "toolbar.text": "Texto",
  "toolbar.placeholder": "Escribe el texto nuevo…",
  "toolbar.font": "Fuente",
  "toolbar.fontError":
    "No se pudo cargar esta fuente. Se usará una fuente del sistema.",
  "toolbar.fontEmpty": "No se encontraron fuentes",
  "toolbar.size": "Tamaño",
  "toolbar.weight": "Grosor",
  "toolbar.color": "Color",
  "toolbar.stroke": "Contorno",
  "toolbar.strokeWidth": "Grosor del contorno",
  "toolbar.opacity": "Opacidad",
  "fontGroup.system": "Sistema",
  "fontGroup.sans": "Sans",
  "fontGroup.serif": "Serif",
  "fontGroup.display": "Display",
  "fontGroup.mono": "Monoespaciada",
  "fontWeight.100": "Fina",
  "fontWeight.200": "Extra ligera",
  "fontWeight.300": "Ligera",
  "fontWeight.400": "Regular",
  "fontWeight.500": "Media",
  "fontWeight.600": "Seminegrita",
  "fontWeight.700": "Negrita",
  "fontWeight.800": "Extra negrita",
  "fontWeight.900": "Negra",

  "region.alt": "Elige la región de texto a editar",
  "region.selectText": "Seleccionar texto",
  "zoom.reset": "Restablecer zoom al tamaño original",

  "export.couldNot": "No se pudo exportar",
  "export.noPending":
    "No hay ninguna exportación en curso. Usa Exportar después de editar una imagen.",
  "export.back": "Volver al editor",
  "export.downloadStarted": "La descarga comenzó",
  "export.saving":
    "{filename} se está guardando en tu computadora. El archivo no salió de este navegador.",
  "export.previewAlt": "Vista previa de la imagen exportada",
  "export.downloadAgain": "Descargar de nuevo",

  "docs.kicker": "Kudos",
  "docs.title": "Gracias a quienes lo hicieron posible",
  "docs.intro":
    "pngn pinta el texto fuera de tus imágenes usando investigación de inpainting publicada. Esta página es un agradecimiento a esos autores. Nada se procesa en un servidor.",
  "docs.privacy": "No guardamos tus imágenes",
  "docs.privacy.p1":
    "No hay procesamiento en el servidor. Encontrar el texto, rellenar el fondo, editar y exportar ocurren en este navegador.",
  "docs.privacy.p2": "El archivo que descargas se construye localmente.",
  "docs.models": "Los modelos que usamos",
  "docs.models.p1":
    "Cuando seleccionas texto, quitamos esas letras y rellenamos el hueco para que el fondo se vea intacto. Dos bibliotecas abiertas de inpainting hacen ese relleno, enteramente en tu dispositivo.",
  "docs.migan": "MI-GAN",
  "docs.migan.authors":
    "Andranik Sargsyan, Shant Navasardyan, Xingqian Xu y Humphrey Shi - Picsart AI Research",
  "docs.migan.p1":
    "Usamos MI-GAN, un modelo compacto de inpainting pensado para restaurar regiones que faltan con rapidez, por eso puede ejecutarse en el navegador mientras editas.",
  "docs.migan.github": "MI-GAN en GitHub",
  "docs.migan.paper": "Artículo de investigación",
  "docs.lama": "LaMa",
  "docs.lama.authors":
    "Roman Suvorov, Elizaveta Logacheva, Anton Mashikhin, Anastasia Remizova, Arsenii Ashukha, Aleksei Silvestrov, Naejin Kong, Harshith Goka, Kiwoong Park y Victor Lempitsky - Samsung AI Center y Skoltech",
  "docs.lama.p1":
    "Usamos LaMa para rellenar huecos más grandes y con más textura. Como MI-GAN, se descarga a tu dispositivo y se ejecuta en local.",
  "docs.lama.github": "LaMa en GitHub",
  "docs.lama.paper": "Artículo de investigación",
  "docs.linkExternal": "se abre en una pestaña nueva",
});

const pl = catalog({
  "nav.primary": "Główne",
  "nav.howItWorks": "Podziękowania",
  "nav.language": "Język",

  "title.home": "Zmień tekst na dowolnym obrazie",
  "title.howItWorks": "Podziękowania — pngn",
  "title.export": "Eksport — pngn",

  "flow.aria": "Jak edytować tekst na obrazie",
  "flow.upload": "Wczytaj obraz",
  "flow.select": "Zaznacz obszar",
  "flow.edit": "Edytuj tekst i eksportuj",

  "landing.heroLead":
    "Zaznacz tekst na obrazie, przepisz go i wyeksportuj nowy obraz.",
  "landing.heroPrivacy": "Za darmo, bezpiecznie i bez konta.",
  "landing.dropTitle": "Upuść obraz tutaj",
  "landing.dropHint": "lub kliknij, aby wybrać: PNG, JPEG lub WebP",
  "landing.privacy":
    "Nie przechowujemy wczytanych obrazów; nigdy nie opuszczają Twojej przeglądarki.",

  "app.newImage": "Nowy obraz",
  "app.dragHint":
    "Przeciągnij ramkę wokół tekstu, który chcesz zmienić. Przewiń, aby powiększyć.",
  "app.editSelected": "Edytuj zaznaczony tekst",
  "app.processing": "Przetwarzanie…",
  "app.cancel": "Anuluj",
  "app.selectAnother": "Zaznacz inny obszar",
  "app.reconstruction": "Rekonstrukcja",
  "app.methodAuto": "Auto",
  "app.methodAutoHintAria": "Kiedy użyć Auto",
  "app.methodAutoHint":
    "Na płaskim tle wypełnia kolorem lub gradientem. Dla zdjęć i złożonych tekstur używa LaMa.",
  "app.methodMigan": "MI-GAN",
  "app.methodMiganHintAria": "Kiedy użyć MI-GAN",
  "app.methodMiganHint":
    "Szybsze wypełnienie. Najlepsze do małego tekstu i prostego, płaskiego tła.",
  "app.methodLama": "LaMa",
  "app.methodLamaHintAria": "Kiedy użyć LaMa",
  "app.methodLamaHint":
    "Wolniejsze, dokładniejsze wypełnienie. Na duży tekst, zdjęcia i złożone tekstury.",
  "app.maskThreshold": "Próg maski",
  "app.maskThresholdHintAria": "Kiedy zmienić próg maski",
  "app.maskThresholdHint":
    "Podnieś, jeśli zostają resztki liter. Obniż, jeśli znika za dużo tła wokół tekstu.",
  "app.maskExpansion": "Rozszerzenie maski",
  "app.maskExpansionHintAria": "Kiedy zmienić rozszerzenie maski",
  "app.maskExpansionHint":
    "Powiększa wymazany obszar wokół liter. Podnieś, jeśli zostaje otoczka starego tekstu.",
  "app.processNewArea": "Przetwórz nowy obszar",
  "app.applySettingsHint":
    "Kliknij warstwę, aby zastosować, albo poczekaj chwilę.",
  "app.selectLayerToApply": "Wybierz warstwę tekstu, aby zastosować.",
  "app.doneEditing": "Skończyłeś edycję?",
  "app.exportFormat": "Format eksportu",
  "app.export": "Eksportuj",
  "app.exporting": "Eksportowanie…",
  "layers.title": "Warstwy",
  "layers.aria": "Warstwy tekstu",
  "layers.empty": "Zaznacz obszar tekstu, aby dodać warstwę.",
  "layers.fallback": "Tekst {n}",
  "layers.background": "Tło",
  "layers.exportPreview": "Podgląd eksportu",
  "layers.remove": "Usuń tekst",

  "stage.waiting": "Oczekiwanie na obraz",
  "stage.reading": "Odczytywanie obrazu",
  "stage.loadingModels": "Ładowanie modeli",
  "stage.ocr": "OCR",
  "stage.masking": "Maskowanie",
  "stage.reconstruction": "Rekonstrukcja",
  "stage.ready": "Gotowe do edycji",
  "stage.failed": "Przetwarzanie nie powiodło się",

  "error.chooseImageType": "Wybierz obraz PNG, JPEG lub WebP.",
  "error.decodeFailed": "Przeglądarka nie mogła odczytać tego obrazu.",
  "error.processingFailed": "Przetwarzanie nie powiodło się.",
  "error.exportFailed": "Eksport nie powiódł się.",
  "error.canvasEncoding": "Nie udało się zakodować płótna.",
  "error.canvasUnavailable": "Canvas 2D jest niedostępny w tej przeglądarce.",
  "error.workerCrashed": "Proces edycji uległ awarii.",
  "error.noTextFound":
    "W tym zaznaczeniu nie znaleziono tekstu. Narysuj nieco szerszy obszar wokół tekstu.",
  "error.imageProcessingFailed": "Przetwarzanie obrazu nie powiodło się.",
  "error.opencvFailed": "Wypełnianie OpenCV nie powiodło się.",

  "toolbar.hint":
    "Kliknij tekst na obrazie, aby go edytować. Przewiń, aby powiększyć.",
  "toolbar.text": "Tekst",
  "toolbar.placeholder": "Wpisz nowy tekst…",
  "toolbar.font": "Czcionka",
  "toolbar.fontError":
    "Nie udało się wczytać tej czcionki. Używana jest czcionka systemowa.",
  "toolbar.fontEmpty": "Nie znaleziono czcionek",
  "toolbar.size": "Rozmiar",
  "toolbar.weight": "Grubość",
  "toolbar.color": "Kolor",
  "toolbar.stroke": "Obrys",
  "toolbar.strokeWidth": "Grubość obrysu",
  "toolbar.opacity": "Krycie",
  "fontGroup.system": "Systemowe",
  "fontGroup.sans": "Bezszeryfowe",
  "fontGroup.serif": "Szeryfowe",
  "fontGroup.display": "Ozdobne",
  "fontGroup.mono": "Monospace",
  "fontWeight.100": "Cienka",
  "fontWeight.200": "Bardzo lekka",
  "fontWeight.300": "Lekka",
  "fontWeight.400": "Zwykła",
  "fontWeight.500": "Średnia",
  "fontWeight.600": "Półgruba",
  "fontWeight.700": "Pogrubiona",
  "fontWeight.800": "Bardzo gruba",
  "fontWeight.900": "Czarna",

  "region.alt": "Wybierz obszar tekstu do edycji",
  "region.selectText": "Zaznacz tekst",
  "zoom.reset": "Przywróć oryginalny rozmiar",

  "export.couldNot": "Nie udało się wyeksportować",
  "export.noPending": "Brak eksportu w toku. Użyj Eksportuj po edycji obrazu.",
  "export.back": "Wróć do edytora",
  "export.downloadStarted": "Pobieranie rozpoczęte",
  "export.saving":
    "{filename} zapisuje się na Twoim komputerze. Plik nie opuścił tej przeglądarki.",
  "export.previewAlt": "Podgląd wyeksportowanego obrazu",
  "export.downloadAgain": "Pobierz ponownie",

  "docs.kicker": "Kudos",
  "docs.title": "Dzięki osobom, które to umożliwiły",
  "docs.intro":
    "pngn zamalowuje tekst na obrazach, korzystając z opublikowanych badań nad inpaintingiem. Ta strona to podziękowanie dla ich autorów. Nic nie jest przetwarzane na serwerze.",
  "docs.privacy": "Nie zapisujemy Twoich obrazów",
  "docs.privacy.p1":
    "Nie ma przetwarzania po stronie serwera. Wykrywanie tekstu, uzupełnianie tła, edycja i eksport odbywają się w tej przeglądarce.",
  "docs.privacy.p2": "Pobierany plik powstaje lokalnie.",
  "docs.models": "Modele, z których korzystamy",
  "docs.models.p1":
    "Gdy zaznaczysz tekst, usuwamy te litery i wypełniamy lukę, żeby tło wyglądało nienaruszone. Dwie otwarte biblioteki inpaintingu robią to wypełnienie w całości na Twoim urządzeniu.",
  "docs.migan": "MI-GAN",
  "docs.migan.authors":
    "Andranik Sargsyan, Shant Navasardyan, Xingqian Xu i Humphrey Shi - Picsart AI Research",
  "docs.migan.p1":
    "MI-GAN to zwarty model inpaintingu stworzony, by szybko odtwarzać brakujące obszary — dlatego może działać w przeglądarce podczas edycji.",
  "docs.migan.github": "MI-GAN na GitHubie",
  "docs.migan.paper": "Artykuł naukowy",
  "docs.lama": "LaMa",
  "docs.lama.authors":
    "Roman Suvorov, Elizaveta Logacheva, Anton Mashikhin, Anastasia Remizova, Arsenii Ashukha, Aleksei Silvestrov, Naejin Kong, Harshith Goka, Kiwoong Park i Victor Lempitsky - Samsung AI Center i Skoltech",
  "docs.lama.p1":
    "LaMa szczególnie dobrze wypełnia większe, bardziej teksturowane dziury. Jak MI-GAN, jest pobierany na urządzenie i uruchamiany lokalnie.",
  "docs.lama.github": "LaMa na GitHubie",
  "docs.lama.paper": "Artykuł naukowy",
  "docs.linkExternal": "otwiera się w nowej karcie",
});

const zh = catalog({
  "nav.primary": "主导航",
  "nav.howItWorks": "致谢",
  "nav.language": "语言",

  "title.home": "修改任意图片上的文字",
  "title.howItWorks": "致谢 — pngn",
  "title.export": "导出 — pngn",

  "flow.aria": "如何编辑图片上的文字",
  "flow.upload": "上传图片",
  "flow.select": "选择区域",
  "flow.edit": "编辑文字并导出",

  "landing.heroLead": "框选图片中的文字，改写后导出新图。",
  "landing.heroPrivacy": "免费、安全，无需账户。",
  "landing.dropTitle": "将图片拖到这里",
  "landing.dropHint": "或点击选择: PNG、JPEG 或 WebP",
  "landing.privacy": "我们不会存储你上传的图片，它们不会离开你的浏览器。",

  "app.newImage": "新图片",
  "app.dragHint": "在要修改的文字周围拖出一个框。滚动可缩放。",
  "app.editSelected": "编辑所选文字",
  "app.processing": "处理中…",
  "app.cancel": "取消",
  "app.selectAnother": "再选一个区域",
  "app.reconstruction": "重建",
  "app.methodAuto": "自动",
  "app.methodAutoHintAria": "何时使用自动",
  "app.methodAutoHint":
    "背景平整时用纯色或渐变填充。照片或复杂纹理则改用 LaMa。",
  "app.methodMigan": "MI-GAN",
  "app.methodMiganHintAria": "何时使用 MI-GAN",
  "app.methodMiganHint": "填补更快。适合小字和简单、平整的背景。",
  "app.methodLama": "LaMa",
  "app.methodLamaHintAria": "何时使用 LaMa",
  "app.methodLamaHint": "更慢但更细致。适合大字、照片或复杂纹理。",
  "app.maskThreshold": "蒙版阈值",
  "app.maskThresholdHintAria": "何时调整蒙版阈值",
  "app.maskThresholdHint": "若还剩字母残影就调高；若文字周围擦得太多就调低。",
  "app.maskExpansion": "蒙版扩展",
  "app.maskExpansionHintAria": "何时调整蒙版扩展",
  "app.maskExpansionHint": "扩大字母周围的擦除范围。若留下旧文字光晕就调高。",
  "app.processNewArea": "处理新区域",
  "app.applySettingsHint": "点击图层以应用，或稍等片刻。",
  "app.selectLayerToApply": "选择一个文字图层以应用。",
  "app.doneEditing": "编辑完成？",
  "app.exportFormat": "导出格式",
  "app.export": "导出",
  "app.exporting": "正在导出…",
  "layers.title": "图层",
  "layers.aria": "文字图层",
  "layers.empty": "选择文字区域以添加图层。",
  "layers.fallback": "文字 {n}",
  "layers.background": "背景",
  "layers.exportPreview": "导出预览",
  "layers.remove": "删除文字",

  "stage.waiting": "等待图片",
  "stage.reading": "正在读取图片",
  "stage.loadingModels": "正在加载模型",
  "stage.ocr": "OCR",
  "stage.masking": "正在生成蒙版",
  "stage.reconstruction": "重建",
  "stage.ready": "可以编辑",
  "stage.failed": "处理失败",

  "error.chooseImageType": "请选择 PNG、JPEG 或 WebP 图片。",
  "error.decodeFailed": "浏览器无法解码此图片。",
  "error.processingFailed": "处理失败。",
  "error.exportFailed": "导出失败。",
  "error.canvasEncoding": "画布编码失败。",
  "error.canvasUnavailable": "此浏览器不支持 Canvas 2D。",
  "error.workerCrashed": "处理进程已崩溃。",
  "error.noTextFound": "在此选区中未找到文字。请在文字周围画一个稍大的区域。",
  "error.imageProcessingFailed": "图片处理失败。",
  "error.opencvFailed": "OpenCV 修复失败。",

  "toolbar.hint": "点击图片中的文字进行编辑。滚动可缩放。",
  "toolbar.text": "文字",
  "toolbar.placeholder": "输入新文字…",
  "toolbar.font": "字体",
  "toolbar.fontError": "无法加载此字体，将改用系统字体。",
  "toolbar.fontEmpty": "未找到字体",
  "toolbar.size": "大小",
  "toolbar.weight": "字重",
  "toolbar.color": "颜色",
  "toolbar.stroke": "描边",
  "toolbar.strokeWidth": "描边粗细",
  "toolbar.opacity": "不透明度",
  "fontGroup.system": "系统",
  "fontGroup.sans": "无衬线",
  "fontGroup.serif": "衬线",
  "fontGroup.display": "展示",
  "fontGroup.mono": "等宽",
  "fontWeight.100": "极细",
  "fontWeight.200": "特细",
  "fontWeight.300": "细",
  "fontWeight.400": "常规",
  "fontWeight.500": "中等",
  "fontWeight.600": "半粗",
  "fontWeight.700": "粗体",
  "fontWeight.800": "特粗",
  "fontWeight.900": "黑体",

  "region.alt": "选择要编辑的文字区域",
  "region.selectText": "选择文字",
  "zoom.reset": "将缩放恢复为原始大小",

  "export.couldNot": "无法导出",
  "export.noPending": "当前没有正在进行的导出。编辑图片后请使用“导出”。",
  "export.back": "返回编辑器",
  "export.downloadStarted": "已开始下载",
  "export.saving": "{filename} 正在保存到你的电脑。文件从未离开此浏览器。",
  "export.previewAlt": "导出图片预览",
  "export.downloadAgain": "再次下载",

  "docs.kicker": "致敬",
  "docs.title": "感谢让这一切成为可能的人",
  "docs.intro":
    "pngn 用已发表的图像修复研究把图片上的文字涂掉。本页向这些作者致谢。不会在服务器上处理任何内容。",
  "docs.privacy": "我们不会保存你的图片",
  "docs.privacy.p1":
    "没有服务端处理。识别文字、填补背景、编辑和导出都在此浏览器中完成。",
  "docs.privacy.p2": "你下载的文件在本地生成。",
  "docs.models": "我们使用的模型",
  "docs.models.p1":
    "当你框选文字后，我们会去掉这些字母并填补空洞，让背景看起来完好。两套开源修复库在你的设备上完成这一步。",
  "docs.migan": "MI-GAN",
  "docs.migan.authors":
    "Andranik Sargsyan、Shant Navasardyan、Xingqian Xu 与 Humphrey Shi - Picsart AI Research",
  "docs.migan.p1":
    "我们使用 MI-GAN，这是一个紧凑的修复模型，专为快速还原缺失区域而设计，因此可以在浏览器里边编辑边运行。",
  "docs.migan.github": "GitHub 上的 MI-GAN",
  "docs.migan.paper": "研究论文",
  "docs.lama": "LaMa",
  "docs.lama.authors":
    "Roman Suvorov、Elizaveta Logacheva、Anton Mashikhin、Anastasia Remizova、Arsenii Ashukha、Aleksei Silvestrov、Naejin Kong、Harshith Goka、Kiwoong Park 与 Victor Lempitsky - Samsung AI Center 与 Skoltech",
  "docs.lama.p1":
    "我们使用 LaMa 填补更大、纹理更复杂的空洞。与 MI-GAN 一样，模型会下载到你的设备并在本地运行。",
  "docs.lama.github": "GitHub 上的 LaMa",
  "docs.lama.paper": "研究论文",
  "docs.linkExternal": "在新标签页打开",
});

const pcm = catalog({
  "nav.primary": "Main menu",
  "nav.howItWorks": "Credits",
  "nav.language": "Language",

  "title.home": "Change writing wey dey for any picture",
  "title.howItWorks": "Credits — pngn",
  "title.export": "Export — pngn",

  "flow.aria": "How to change writing for picture",
  "flow.upload": "Upload picture",
  "flow.select": "Choose area",
  "flow.edit": "Change the writing den export",

  "landing.heroLead":
    "Select the writing wey dey for picture, change am, den export new picture.",
  "landing.heroPrivacy": "E free, e safe, and you no need account.",
  "landing.dropTitle": "Drop picture for here",
  "landing.dropHint": "or click make you choose: PNG, JPEG, or WebP",
  "landing.privacy":
    "We no dey store the pictures wey you upload; dem no dey leave this browser.",

  "app.newImage": "New picture",
  "app.dragHint":
    "Drag box around the writing wey you wan change. Scroll make e zoom.",
  "app.editSelected": "Change the writing wey you select",
  "app.processing": "E dey process…",
  "app.cancel": "Cancel",
  "app.selectAnother": "Select another area",
  "app.reconstruction": "Reconstruction",
  "app.methodAuto": "Auto",
  "app.methodAutoHintAria": "When to use Auto",
  "app.methodAutoHint":
    "If background dey plain, e go fill with colour or gradient. For photo or busy texture e go use LaMa.",
  "app.methodMigan": "MI-GAN",
  "app.methodMiganHintAria": "When to use MI-GAN",
  "app.methodMiganHint":
    "E fast. E better for small writing and simple or plain background.",
  "app.methodLama": "LaMa",
  "app.methodLamaHintAria": "When to use LaMa",
  "app.methodLamaHint":
    "E slow pass, but e fill better. Use am for big writing, photo, or busy texture.",
  "app.maskThreshold": "Mask threshold",
  "app.maskThresholdHintAria": "When to change mask threshold",
  "app.maskThresholdHint":
    "Increase am if letter bits still remain. Reduce am if too much around the writing don erase.",
  "app.maskExpansion": "Mask expansion",
  "app.maskExpansionHintAria": "When to change mask expansion",
  "app.maskExpansionHint":
    "Make the erase area around letters grow. Increase am if old writing halo still dey.",
  "app.processNewArea": "Process new area",
  "app.applySettingsHint": "Click the writing layer to apply, or wait small.",
  "app.selectLayerToApply": "Select one writing layer to apply.",
  "app.doneEditing": "You don finish edit?",
  "app.exportFormat": "Export format",
  "app.export": "Export",
  "app.exporting": "E dey export…",
  "layers.title": "Layers",
  "layers.aria": "Text layers",
  "layers.empty": "Select the writing area make you add layer.",
  "layers.fallback": "Text {n}",
  "layers.background": "Background",
  "layers.exportPreview": "Export Preview",
  "layers.remove": "Remove the writing",

  "stage.waiting": "E dey wait for picture",
  "stage.reading": "E dey read the picture",
  "stage.loadingModels": "E dey load models",
  "stage.ocr": "OCR",
  "stage.masking": "E dey mask",
  "stage.reconstruction": "Reconstruction",
  "stage.ready": "E don ready to edit",
  "stage.failed": "Processing no work",

  "error.chooseImageType": "Choose PNG, JPEG, or WebP picture.",
  "error.decodeFailed": "This browser no fit read this picture.",
  "error.processingFailed": "Processing no work.",
  "error.exportFailed": "Export no work.",
  "error.canvasEncoding": "Canvas encoding no work.",
  "error.canvasUnavailable": "Canvas 2D no dey for this browser.",
  "error.workerCrashed": "The processing worker don crash.",
  "error.noTextFound":
    "E no see any writing for this selection. Draw area wey big small around the writing.",
  "error.imageProcessingFailed": "Picture processing no work.",
  "error.opencvFailed": "OpenCV inpainting no work.",

  "toolbar.hint":
    "Click the writing for the picture make you edit am. Scroll make e zoom.",
  "toolbar.text": "Writing",
  "toolbar.placeholder": "Type your new writing…",
  "toolbar.font": "Font",
  "toolbar.fontError": "E no fit load this font. E go use system font instead.",
  "toolbar.fontEmpty": "E no find any font",
  "toolbar.size": "Size",
  "toolbar.weight": "Weight",
  "toolbar.color": "Color",
  "toolbar.stroke": "Outline",
  "toolbar.strokeWidth": "Outline thickness",
  "toolbar.opacity": "Opacity",
  "fontGroup.system": "System",
  "fontGroup.sans": "Sans",
  "fontGroup.serif": "Serif",
  "fontGroup.display": "Display",
  "fontGroup.mono": "Monospace",
  "fontWeight.100": "Thin",
  "fontWeight.200": "Extra light",
  "fontWeight.300": "Light",
  "fontWeight.400": "Regular",
  "fontWeight.500": "Medium",
  "fontWeight.600": "Semibold",
  "fontWeight.700": "Bold",
  "fontWeight.800": "Extra bold",
  "fontWeight.900": "Black",

  "region.alt": "Choose the writing area wey you wan edit",
  "region.selectText": "Select writing",
  "zoom.reset": "Reset zoom go original size",

  "export.couldNot": "E no fit export",
  "export.noPending":
    "No export dey happen. Use Export after you don edit picture.",
  "export.back": "Go back to editor",
  "export.downloadStarted": "Download don start",
  "export.saving":
    "{filename} dey save for your computer. The file no leave this browser.",
  "export.previewAlt": "Preview of the picture wey you export",
  "export.downloadAgain": "Download am again",

  "docs.kicker": "Kudos",
  "docs.title": "Thank you to di people wey make am possible",
  "docs.intro":
    "pngn dey paint text komot from your image using published inpainting research. Dis page na thank-you to those authors. Nothing dey process for server.",
  "docs.privacy": "We no dey save your pictures",
  "docs.privacy.p1":
    "No server-side processing. To find di text, fill di background, edit, and export, all dey happen for dis browser.",
  "docs.privacy.p2": "Di file wey you download, na locally dem build am.",
  "docs.models": "Di models we dey use",
  "docs.models.p1":
    "When you select text, we go remove those letters and fill di hole so di background go look intact. Two open inpainting libraries dey do that fill, all for your device.",
  "docs.migan": "MI-GAN",
  "docs.migan.authors":
    "Andranik Sargsyan, Shant Navasardyan, Xingqian Xu, and Humphrey Shi - Picsart AI Research",
  "docs.migan.p1":
    "We dey use MI-GAN. E be compact inpainting model wey dem build to restore missing regions quick, na why e fit run for browser as you dey edit.",
  "docs.migan.github": "MI-GAN on GitHub",
  "docs.migan.paper": "Research paper",
  "docs.lama": "LaMa",
  "docs.lama.authors":
    "Roman Suvorov, Elizaveta Logacheva, Anton Mashikhin, Anastasia Remizova, Arsenii Ashukha, Aleksei Silvestrov, Naejin Kong, Harshith Goka, Kiwoong Park, and Victor Lempitsky - Samsung AI Center and Skoltech",
  "docs.lama.p1":
    "We dey use LaMa to fill bigger, more textured holes. Like MI-GAN, e dey download to your device and run locally.",
  "docs.lama.github": "LaMa on GitHub",
  "docs.lama.paper": "Research paper",
  "docs.linkExternal": "e go open for new tab",
});

const ar = catalog({
  "nav.primary": "رئيسي",
  "nav.howItWorks": "شكر وتقدير",
  "nav.language": "اللغة",

  "title.home": "غيّر النص في أي صورة",
  "title.howItWorks": "شكر وتقدير — pngn",
  "title.export": "تصدير — pngn",

  "flow.aria": "كيفية تعديل النص في صورة",
  "flow.upload": "حمّل صورة",
  "flow.select": "حدّد المنطقة",
  "flow.edit": "عدّل النص ثم صدّر",

  "landing.heroLead": "حدّد النص في الصورة، أعد كتابته، ثم صدّر صورة جديدة.",
  "landing.heroPrivacy": "مجاني وآمن وبدون حساب.",
  "landing.dropTitle": "أفلت صورة هنا",
  "landing.dropHint": "أو انقر للاختيار: PNG أو JPEG أو WebP",
  "landing.privacy": "لا نخزّن الصور المرفوعة، وهي لا تغادر هذا المتصفح.",

  "app.newImage": "صورة جديدة",
  "app.dragHint": "اسحب مربعًا حول النص الذي تريد تغييره. مرّر للتكبير.",
  "app.editSelected": "تعديل النص المحدد",
  "app.processing": "جارٍ المعالجة…",
  "app.cancel": "إلغاء",
  "app.selectAnother": "تحديد منطقة أخرى",
  "app.reconstruction": "إعادة البناء",
  "app.methodAuto": "تلقائي",
  "app.methodAutoHintAria": "متى تستخدم الوضع التلقائي",
  "app.methodAutoHint":
    "يملأ الخلفيات المسطحة بلون أو تدرج بسيط. يستخدم LaMa للصور والأنسجة المعقدة.",
  "app.methodMigan": "MI-GAN",
  "app.methodMiganHintAria": "متى تستخدم MI-GAN",
  "app.methodMiganHint":
    "ملء أسرع. الأنسب للنص الصغير والخلفيات البسيطة أو المسطحة.",
  "app.methodLama": "LaMa",
  "app.methodLamaHintAria": "متى تستخدم LaMa",
  "app.methodLamaHint":
    "أبطأ وأكثر تفصيلًا. استخدمه للنص الكبير أو الصور أو الأنسجة المعقدة.",
  "app.maskThreshold": "عتبة القناع",
  "app.maskThresholdHintAria": "متى تغيّر عتبة القناع",
  "app.maskThresholdHint":
    "ارفعها إن بقيت بقايا حروف. اخفضها إن مُحي الكثير حول النص.",
  "app.maskExpansion": "توسيع القناع",
  "app.maskExpansionHintAria": "متى تغيّر توسيع القناع",
  "app.maskExpansionHint":
    "يكبّر المنطقة الممحوّة حول الحروف. ارفعه إن بقي هالة من النص القديم.",
  "app.processNewArea": "معالجة منطقة جديدة",
  "app.applySettingsHint": "انقر على الطبقة للتطبيق، أو انتظر لحظة.",
  "app.selectLayerToApply": "حدد طبقة نص للتطبيق.",
  "app.doneEditing": "أنهيت التعديل؟",
  "app.exportFormat": "صيغة التصدير",
  "app.export": "تصدير",
  "app.exporting": "جارٍ التصدير…",
  "layers.title": "الطبقات",
  "layers.aria": "طبقات النص",
  "layers.empty": "حدّد منطقة نص لإضافة طبقة.",
  "layers.fallback": "نص {n}",
  "layers.background": "الخلفية",
  "layers.exportPreview": "معاينة التصدير",
  "layers.remove": "إزالة النص",

  "stage.waiting": "بانتظار صورة",
  "stage.reading": "جارٍ قراءة الصورة",
  "stage.loadingModels": "جارٍ تحميل النماذج",
  "stage.ocr": "التعرف",
  "stage.masking": "جارٍ إنشاء القناع",
  "stage.reconstruction": "إعادة البناء",
  "stage.ready": "جاهز للتعديل",
  "stage.failed": "فشلت المعالجة",

  "error.chooseImageType": "اختر صورة PNG أو JPEG أو WebP.",
  "error.decodeFailed": "تعذر على المتصفح فك ترميز هذه الصورة.",
  "error.processingFailed": "فشلت المعالجة.",
  "error.exportFailed": "فشل التصدير.",
  "error.canvasEncoding": "فشل ترميز اللوحة.",
  "error.canvasUnavailable": "Canvas 2D غير متاح في هذا المتصفح.",
  "error.workerCrashed": "توقفت عملية المعالجة.",
  "error.noTextFound":
    "لم يُعثر على نص في هذا التحديد. ارسم منطقة أوسع قليلًا حول النص.",
  "error.imageProcessingFailed": "فشلت معالجة الصورة.",
  "error.opencvFailed": "فشل ملء OpenCV.",

  "toolbar.hint": "انقر النص في الصورة لتعديله. مرّر للتكبير.",
  "toolbar.text": "النص",
  "toolbar.placeholder": "اكتب النص الجديد…",
  "toolbar.font": "الخط",
  "toolbar.fontError": "تعذر تحميل هذا الخط. سيُستخدم خط النظام بدلًا منه.",
  "toolbar.fontEmpty": "لم يُعثر على خطوط",
  "toolbar.size": "الحجم",
  "toolbar.weight": "السُمك",
  "toolbar.color": "اللون",
  "toolbar.stroke": "الحد",
  "toolbar.strokeWidth": "سُمك الحد",
  "toolbar.opacity": "العتامة",
  "fontGroup.system": "النظام",
  "fontGroup.sans": "بدون تذييل",
  "fontGroup.serif": "بتذييل",
  "fontGroup.display": "عرض",
  "fontGroup.mono": "ثابت العرض",
  "fontWeight.100": "رفيع جدًا",
  "fontWeight.200": "رفيع إضافي",
  "fontWeight.300": "رفيع",
  "fontWeight.400": "عادي",
  "fontWeight.500": "متوسط",
  "fontWeight.600": "شبه عريض",
  "fontWeight.700": "عريض",
  "fontWeight.800": "عريض جدًا",
  "fontWeight.900": "أسود",

  "region.alt": "اختر منطقة النص للتعديل",
  "region.selectText": "تحديد النص",
  "zoom.reset": "إعادة التكبير إلى الحجم الأصلي",

  "export.couldNot": "تعذر التصدير",
  "export.noPending": "لا يوجد تصدير قيد التنفيذ. استخدم تصدير بعد تعديل صورة.",
  "export.back": "العودة إلى المحرر",
  "export.downloadStarted": "بدأ التنزيل",
  "export.saving": "يجري حفظ {filename} على جهازك. لم يغادر الملف هذا المتصفح.",
  "export.previewAlt": "معاينة الصورة المُصدَّرة",
  "export.downloadAgain": "تنزيل مرة أخرى",

  "docs.kicker": "تحية",
  "docs.title": "شكرًا لمن جعل هذا ممكنًا",
  "docs.intro":
    "يطلي pngn النص خارج صورك باستخدام أبحاث ترميم الصور المنشورة. هذه الصفحة شكر لهؤلاء المؤلفين. لا يُعالَج شيء على خادم.",
  "docs.privacy": "لا نحفظ صورك",
  "docs.privacy.p1":
    "لا توجد معالجة على الخادم. إيجاد النص وملء الخلفية والتحرير والتصدير تحدث كلها في هذا المتصفح.",
  "docs.privacy.p2": "يُبنى الملف الذي تحمّله محليًا.",
  "docs.models": "النماذج التي نستخدمها",
  "docs.models.p1":
    "عندما تحدد نصًا، نزيل تلك الحروف ونملأ الفراغ لتبدو الخلفية سليمة. مكتبتان مفتوحتان لترميم الصور تقومان بهذا الملء بالكامل على جهازك.",
  "docs.migan": "MI-GAN",
  "docs.migan.authors":
    "Andranik Sargsyan و Shant Navasardyan و Xingqian Xu و Humphrey Shi - Picsart AI Research",
  "docs.migan.p1":
    "نستخدم MI-GAN، وهو نموذج ترميم مدمج صُمم لاستعادة المناطق الناقصة بسرعة، ولهذا يمكن تشغيله في المتصفح أثناء التحرير.",
  "docs.migan.github": "MI-GAN على GitHub",
  "docs.migan.paper": "ورقة بحثية",
  "docs.lama": "LaMa",
  "docs.lama.authors":
    "Roman Suvorov و Elizaveta Logacheva و Anton Mashikhin و Anastasia Remizova و Arsenii Ashukha و Aleksei Silvestrov و Naejin Kong و Harshith Goka و Kiwoong Park و Victor Lempitsky - Samsung AI Center و Skoltech",
  "docs.lama.p1":
    "نستخدم LaMa لملء الثقوب الأكبر والأكثر نسيجًا. مثل MI-GAN، يُنزَّل إلى جهازك ويُشغَّل محليًا.",
  "docs.lama.github": "LaMa على GitHub",
  "docs.lama.paper": "ورقة بحثية",
  "docs.linkExternal": "يُفتح في علامة تبويب جديدة",
});

export const messages: Record<Locale, Messages> = {
  en,
  es,
  pl,
  zh,
  pcm,
  ar,
};

const ERROR_BY_MESSAGE: Record<string, MessageKey> = {
  "Choose a PNG, JPEG, or WebP image.": "error.chooseImageType",
  "This image could not be decoded by the browser.": "error.decodeFailed",
  "Processing failed.": "error.processingFailed",
  "Export failed.": "error.exportFailed",
  "Canvas encoding failed.": "error.canvasEncoding",
  "Canvas 2D is unavailable in this browser.": "error.canvasUnavailable",
  "The processing worker crashed.": "error.workerCrashed",
  "No text was found in this selection. Draw a slightly wider area around the text.":
    "error.noTextFound",
  "Image processing failed.": "error.imageProcessingFailed",
  "OpenCV inpainting failed.": "error.opencvFailed",
};

export type Translate = (
  key: MessageKey,
  vars?: Record<string, string | number>,
) => string;

export const interpolate = (
  template: string,
  vars?: Record<string, string | number>,
) => {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.hasOwn(vars, name) ? String(vars[name]) : match,
  );
};

export const translate = (
  locale: Locale,
  key: MessageKey,
  vars?: Record<string, string | number>,
) => interpolate(messages[locale][key] ?? messages.en[key], vars);

export const translateError = (locale: Locale, message: string) =>
  translate(locale, ERROR_BY_MESSAGE[message] ?? "error.processingFailed");
