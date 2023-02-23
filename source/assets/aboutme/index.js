var ab = document.querySelector(".aboutme-container");
var land = document.querySelector(".aboutme-container #land");
var topCloud1 = document.querySelector(".aboutme-container #top-cloud1");
var topCloud2 = document.querySelector(".aboutme-container #top-cloud2");
var cloud1 = document.querySelector(".aboutme-container #cloud1");
var leaf1 = document.querySelector(".aboutme-container #leaf1");
var sf1 = document.querySelector(".aboutme-container #sf1");
var sf2 = document.querySelector(".aboutme-container #sf2");
var sf3 = document.querySelector(".aboutme-container #sf3");
ab.addEventListener("mousemove", (e) => {
  var x = e.x;
  var w = ab.clientWidth;
  var getPerspective = (ratio) => {
    return `translatex(${(x / w) * ratio}%)`;
  };
  topCloud1.style.transform = getPerspective(0.2);
  topCloud2.style.transform = getPerspective(-0.2);

  land.style.transform = getPerspective(-0.5);
  cloud1.style.transform = getPerspective(-0.5);
  leaf1.style.transform = getPerspective(20);
  sf1.style.transform = getPerspective(9);
  sf2.style.transform = getPerspective(-5);
  sf3.style.transform = getPerspective(-4);
});
