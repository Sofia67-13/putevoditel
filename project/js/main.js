	const walkMatrix = {
            "Кремль-Парк Горького": 40, "Кремль-Третьяковка": 20, "Кремль-ВДНХ": 130, "Кремль-Большой театр": 10, "Кремль-Арбат": 12,
            "Парк Горького-Третьяковка": 25, "Парк Горького-ВДНХ": 150, "Парк Горького-Большой театр": 45, "Парк Горького-Арбат": 35,
            "Третьяковка-ВДНХ": 140, "Третьяковка-Большой театр": 25, "Третьяковка-Арбат": 30,
            "ВДНХ-Большой театр": 120, "ВДНХ-Арбат": 135, "Большой театр-Арбат": 25
        };
        function getWalkTime(a,b) {
            if(a===b) return 0;
            let key = a+"-"+b;
            if(walkMatrix[key]) return walkMatrix[key];
            key = b+"-"+a;
            return walkMatrix[key] || null;
        }

        const allPlaces = ["Московский Кремль","Парк Горького","Третьяковская галерея","ВДНХ","Большой театр","Старый Арбат","Музей советских игровых автоматов","Крыши высотки на Котельнической","Бункер-42 на Таганке","Усадьба Коломенское","Фабрика мороженого","Музей криптографии"];
        
        document.getElementById("randomPlaceBtn").onclick = () => {
            let rand = allPlaces[Math.floor(Math.random()*allPlaces.length)];
            document.getElementById("randomPlaceResult").innerHTML = `✨ Рекомендуем посетить: <strong>${rand}</strong>`;
        };

        document.getElementById("calcTimeBtn").onclick = () => {
            let from = document.getElementById("routeFrom").value;
            let to = document.getElementById("routeTo").value;
            let mins = getWalkTime(from,to);
            if(mins !== null) {
                let txt = mins >= 60 ? Math.floor(mins/60)+" ч "+(mins%60)+" мин" : mins+" мин";
                document.getElementById("calcResult").innerHTML = `🚶 От ${from} до ${to} пешком: ${txt}.`;
            } else {
                document.getElementById("calcResult").innerHTML = `⚠️ Данные для маршрута ${from}→${to} отсутствуют.`;
            }
        };

        document.getElementById("generateItineraryBtn").onclick = () => {
            let shuffled = [...allPlaces];
            for(let i = shuffled.length - 1; i > 0; i--){
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            let itinerary = shuffled.slice(0, 3);
            document.getElementById("itineraryResult").innerHTML = `🗺️ Маршрут на выходные:<br> 1. ${itinerary[0]}<br> 2. ${itinerary[1]}<br> 3. ${itinerary[2]}`;
        };

        document.getElementById("buildRouteBtn").onclick = () => {
            let start = document.getElementById("startPoint").value;
            let end = document.getElementById("endPoint").value;
            let url = `https://yandex.ru/maps/?rtext=${start}~${end}&rtt=auto`;
            window.open(url, "_blank");
        };

        let reviews = [];
        function loadReviews() {
            let stored = localStorage.getItem("moscowGuideReviews");
            if(stored) reviews = JSON.parse(stored);
            else reviews = [{name:"Анна", text:"Очень удобный сайт, карты работают!"},{name:"Иван", text:"Классно, что можно сразу построить маршрут."}];
            renderReviews();
        }
        function saveReviews() { localStorage.setItem("moscowGuideReviews", JSON.stringify(reviews)); }
        function renderReviews() {
            let container = document.getElementById("reviewsList");
            if(!container) return;
            container.innerHTML = "";
            if(reviews.length===0) { container.innerHTML = "<p>Пока нет отзывов. Будьте первым!</p>"; return; }
            reviews.forEach((r, idx) => {
                let div = document.createElement("div");
                div.className = "review-item";
                div.innerHTML = `<strong>${escapeHtml(r.name)}</strong><p>${escapeHtml(r.text)}</p><button class="delete-review" data-idx="${idx}">🗑️ Удалить</button>`;
                container.appendChild(div);
            });
            document.querySelectorAll(".delete-review").forEach(btn => {
                btn.onclick = () => {
                    let idx = parseInt(btn.getAttribute("data-idx"));
                    reviews.splice(idx,1);
                    saveReviews();
                    renderReviews();
                };
            });
        }
        function escapeHtml(str) { return str.replace(/[&<>]/g, function(m){ if(m==='&') return '&amp;'; if(m==='<') return '&lt;'; if(m==='>') return '&gt;'; return m;}); }
        document.getElementById("addReviewBtn").onclick = () => {
            let name = document.getElementById("reviewName").value.trim();
            let text = document.getElementById("reviewText").value.trim();
            if(!name || !text) { alert("Заполните имя и отзыв"); return; }
            reviews.unshift({name, text});
            saveReviews();
            renderReviews();
            document.getElementById("reviewName").value = "";
            document.getElementById("reviewText").value = "";
        };
        loadReviews();

        const modal = document.getElementById("placeModal");
        const modalTitle = document.getElementById("modalTitle");
        const modalTime = document.getElementById("modalTime");
        const modalPrice = document.getElementById("modalPrice");
        const modalDesc = document.getElementById("modalDesc");
        const modalImage = document.getElementById("modalImage");
        const closeModal = document.querySelector(".close-modal");

        document.querySelectorAll(".card").forEach(card => {
            card.addEventListener("click", (e) => {
                if(e.target.classList && e.target.classList.contains("btn")) return;
                modalTitle.textContent = card.getAttribute("data-name");
                modalTime.textContent = card.getAttribute("data-time");
                modalPrice.textContent = card.getAttribute("data-price");
                modalDesc.textContent = card.getAttribute("data-desc");
                let imgUrl = card.getAttribute("data-img");
                modalImage.style.backgroundImage = `url('${imgUrl}')`;
                modal.style.display = "flex";
            });
        });

        closeModal.onclick = () => { modal.style.display = "none"; };
        window.onclick = (e) => { if(e.target === modal) modal.style.display = "none"; };