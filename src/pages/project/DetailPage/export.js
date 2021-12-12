//return URL of JSON file
export function exportCOCO(currentProject) {
  var date = new Date();

  let info = {
    description: `${currentProject.name} ${currentProject.description}`,
    url: 'https://raynor.top',
    version: '1.0',
    year: 2021,
    contributor: 'Xuzheng Chen',
    date_created: `${date.getFullYear()}/${date.getMonth()}/${date.getDay}`,
  };
  let licenses = [
    {
      url: 'http://creativecommons.org/licenses/by-nc-sa/2.0/',
      id: 1,
      name: 'Attribution-NonCommercial-ShareAlike License',
    },
  ];

  let images = currentProject.images.map((r) => {
    let ret = { lincese: 1, file_name: r.name, id: r.id, date_captured: r.uploadTime };
    let annotatioin = currentProject.annotationMap[r.id];
    if (annotatioin) {
      let pixelSize = JSON.parse(annotatioin.pixelSize ? annotatioin.pixelSize : '{}') || {};
      ret.height = pixelSize.h;
      ret.width = pixelSize.w;
      ret.coco_url = annotatioin.src;
      ret.flickr_url = annotatioin.src;
    }
    return ret;
  });
  let categories = currentProject.class.tags.map((r) => {
    return {
      id: r.id,
      name: r.content,
      supercategory: currentProject.class.className,
    };
  });
  let annotations = [];
  currentProject.annotations.forEach((r) => {
    let pixelSize = JSON.parse(r.pixelSize ? r.pixelSize : '{}') || {};
    let regions = JSON.parse(r.regions ? r.regions : '[]') || [];
    regions.forEach((e) => {
      let beginX = 0,
        beginY = 0,
        width = 0,
        height = 0;
      let segmentation = [];
      let area = 0;
      let annotationId = e.id;
      switch (e.type) {
        case 'box':
          beginX = pixelSize.w * e.x;
          beginY = pixelSize.h * e.y;
          width = pixelSize.w * e.w;
          height = pixelSize.h * e.h;
          area = width * height;
          break;
        case 'point':
          beginX = pixelSize.w * e.x;
          beginY = pixelSize.h * e.y;
          width = height = 1;
          area = 1;
          break;
        case 'polygon':
          segmentation = e.points;
          break;
        case 'line':
          beginX = pixelSize.w * e.x1;
          beginY = pixelSize.h * e.y1;
          width = pixelSize.w * e.x2;
          height = pixelSize.h * e.y2;
          area = 1;
        default:
          break;
      }

      annotations.push({
        iscrowd: 0,
        image_id: r.imageId,
        category_id: currentProject.class.id,
        id: annotationId,
        area,
        segmentation,
        bbox: [beginX, beginY, width, height],
      });
    });
  });
  let ans = { info, licenses, images, annotations, categories };
  const jsr = JSON.stringify(ans);
  const blob = new Blob([jsr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'test.json';
  document.documentElement.appendChild(a);
  a.click();
  document.documentElement.removeChild(a);
}
