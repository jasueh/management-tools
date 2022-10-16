$(document).ready(function () {
  const base = (document.querySelector("base") || {}).href;
  const container = $("#sortable");

  const liveStats = () => {
    let hidden, visibilityChange;

    if (typeof document.hidden !== "undefined") {
      // Opera 12.10 and Firefox 18 and later support
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }

    const livestatsRefreshTimeouts = [];
    const livestatsFuncs = [];
    const livestatsContainers = $(".livestats-container");

    function stopLivestatsRefresh() {
      for (
        let _i = 0, _livestatsRefreshTime = livestatsRefreshTimeouts;
        _i < _livestatsRefreshTime.length;
        _i++
      ) {
        const timeoutId = _livestatsRefreshTime[_i];
        window.clearTimeout(timeoutId);
      }
    }

    function startLivestatsRefresh() {
      for (
        let _i2 = 0, _livestatsFuncs = livestatsFuncs;
        _i2 < _livestatsFuncs.length;
        _i2++
      ) {
        const fun = _livestatsFuncs[_i2];
        fun();
      }
    }

    if (livestatsContainers.length > 0) {
      if (
        typeof document.addEventListener === "undefined" ||
        hidden === undefined
      ) {
        console.log("This browser does not support visibilityChange");
      } else {
        document.addEventListener(
          visibilityChange,
          function () {
            if (document[hidden]) {
              stopLivestatsRefresh();
            } else {
              startLivestatsRefresh();
            }
          },
          false
        );
      }

      livestatsContainers.each(function (index) {
        const id = $(this).data("id");
        const dataonly = $(this).data("dataonly");
        const increaseby = dataonly == 1 ? 20000 : 1000;
        const container = $(this);
        const max_timer = 30000;
        let timer = 5000;
        console.log("got here 5");
        const fun = function worker() {
          $.ajax({
            url: base + "get_stats/" + id,
            dataType: "json",
            success: function success(data) {
              container.html(data.html);
              if (data.status == "active"){ 
                timer = increaseby;
                console.log("got here 3");
              } else {
                if (timer < max_timer) timer += 2000;
                console.log("got here 4");
              }
            },
            complete: function complete() {
              // Schedule the next request when the current one's complete
              livestatsRefreshTimeouts[index] = window.setTimeout(
                worker,
                timer
              );
            },
          });
        };

        livestatsFuncs[index] = fun;
        fun();
      });
    }
  };

  const customMain = () => {
    if (window.location.pathname !== "/") return;

    container.html("");
    container.css("opacity", "1");
    console.log("got here 1"+base);

    $.get(base + "tags", function (data) {
      console.log("got here 6"+data)
      const tagArr = Array.from($("tbody tr td a", data));
      console.log("got here 7"+tagArr);
      console.log("got here 8"+data);

      tags = tagArr
        .filter((_d, idx) => idx % 2 === 0)
        .map((node) => node.href.split("/").pop());
      const tagPromises = tags.map((tag) => $.get(base + "tag/" + tag));

      if (tags.length === 0) return;
      console.log("got here 2");
      Promise.all(tagPromises)
        .then((tagsHtml) => {
          const tagsNodes = tagsHtml.map((html, idx) => {
            const inner = $("#sortable", html).html();
            const wrapper1 = document.createElement("div");
            const wrapper2 = document.createElement("div");
            wrapper2.classList.add("tags-container");
            wrapper2.innerHTML = inner;
            const divTitle = document.createElement("div");
            const tagTitle = document.createElement("h4");
            tagTitle.classList.add("tags-title");
            tagTitle.textContent = tags[idx].replaceAll("-", " ");
            divTitle.classList.add("tags-title-container");
            divTitle.appendChild(tagTitle)
            wrapper1.append(divTitle);
            wrapper1.append(wrapper2);
            return wrapper1;
          });
          container.append(tagsNodes);
        })
        .finally(() => liveStats());
    });
  };

  customMain();
});