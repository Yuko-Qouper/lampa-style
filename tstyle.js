(function () {
    'use strict';

    var config = {
        name: 'Yuko Torrent Style',
        pluginId: 'yuko_ts_mod'
    };

    // Стили (CSS)
    var styles = `
        /* Базовый вид плашек */
        .torrent-item__bitrate > span, .torrent-item__seeds > span, .torrent-item__grabs > span, .torrent-item__size {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            min-height: 1.7em !important;
            padding: 0.15em 0.5em !important;
            border-radius: 0.5em !important;
            font-weight: 700 !important;
            font-size: 0.9em !important;
            line-height: 1 !important;
            white-space: nowrap !important;
            margin-right: 0.5em !important;
        }

        /* Сиды: Изумрудный (норма), Золотой (топ), Красный (мало) */
        .ts-seeds { color: #5cd4b0; background: rgba(92, 212, 176, 0.15); border: 1px solid #5cd4b0; }
        .ts-seeds.good-seeds { color: #43cea2; background: rgba(67, 206, 162, 0.2); border: 1px solid #43cea2; box-shadow: 0 0 10px rgba(67, 206, 162, 0.4); }
        .ts-seeds.high-seeds { color: #ffc371; background: rgba(255, 195, 113, 0.2); border: 1px solid #ffc371; box-shadow: 0 0 12px rgba(255, 195, 113, 0.5); }
        .ts-seeds.low-seeds { color: #ff5f6d; background: rgba(255, 95, 109, 0.15); border: 1px solid #ff5f6d; }

        /* Битрейт: Изумрудный, Золотой (50-100), Красный (>100) */
        .ts-bitrate { color: #5cd4b0; background: rgba(92, 212, 176, 0.1); border: 1px solid #5cd4b0; }
        .ts-bitrate.high-bitrate { color: #ffc371; background: rgba(255, 195, 113, 0.2); border: 1px solid #ffc371; }
        .ts-bitrate.very-high-bitrate { color: #ff5f6d; background: rgba(255, 95, 109, 0.2); border: 1px solid #ff5f6d; }

        /* Размер файла */
        .ts-size { color: #5cd4b0; background: rgba(92, 212, 176, 0.12); border: 1px solid #5cd4b0; }
        .ts-size.mid-size { color: #43cea2; border-color: #43cea2; }
        .ts-size.high-size { color: #ffc371; border-color: #ffc371; }
        .ts-size.top-size { color: #ff5f6d; border-color: #ff5f6d; }

        .torrent-item.focus::after { border: 2px solid #5cd4b0 !important; border-radius: 0.8em !important; }
    `;

    function injectStyles() {
        if (document.getElementById(config.pluginId)) return;
        var style = document.createElement('style');
        style.id = config.pluginId;
        style.innerHTML = styles;
        document.head.appendChild(style);
    }

    function update() {
        // Парсинг Сидов
        document.querySelectorAll('.torrent-item__seeds span').forEach(function (el) {
            var val = parseInt(el.textContent);
            el.classList.add('ts-seeds');
            el.classList.remove('low-seeds', 'good-seeds', 'high-seeds');
            if (val < 5) el.classList.add('low-seeds');
            else if (val >= 20) el.classList.add('high-seeds');
            else if (val >= 10) el.classList.add('good-seeds');
        });

        // Парсинг Битрейта
        document.querySelectorAll('.torrent-item__bitrate span').forEach(function (el) {
            var val = parseFloat(el.textContent.replace(',', '.'));
            el.classList.add('ts-bitrate');
            el.classList.remove('high-bitrate', 'very-high-bitrate');
            if (val > 100) el.classList.add('very-high-bitrate');
            else if (val >= 50) el.classList.add('high-bitrate');
        });

        // Парсинг Размера
        document.querySelectorAll('.torrent-item__size').forEach(function (el) {
            var text = el.textContent.toLowerCase();
            var val = parseFloat(text.replace(',', '.'));
            el.classList.add('ts-size');
            el.classList.remove('mid-size', 'high-size', 'top-size');
            if (text.includes('gb') || text.includes('гб')) {
                if (val > 200) el.classList.add('top-size');
                else if (val >= 100) el.classList.add('high-size');
                else if (val >= 50) el.classList.add('mid-size');
            } else if (text.includes('tb') || text.includes('тб')) {
                el.classList.add('top-size');
            }
        });
    }

    function init() {
        injectStyles();
        setInterval(update, 1000); // Простая проверка каждую секунду
        console.log(config.name + ' Initialized');
    }

    if (window.appready) init();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') init();
        });
    }
})();
