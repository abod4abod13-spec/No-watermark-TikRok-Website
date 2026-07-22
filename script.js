// ==========================================================================
// Abood Downloader - Real Live API Logic (2026)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {

    // 1. إخفاء Splash Screen
    window.addEventListener("load", () => {
        const splash = document.getElementById("splash");
        if (splash) {
            setTimeout(() => {
                splash.style.opacity = "0";
                setTimeout(() => splash.remove(), 800);
            }, 1200);
        }
    });

    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 2. زر العودة للأعلى وشريط التقدم
    const topBtn = document.getElementById("topBtn");
    const progress = document.getElementById("scrollProgress");

    window.addEventListener("scroll", () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (height > 0 && progress) {
            progress.style.width = (winScroll / height) * 100 + "%";
        }
        if (topBtn) {
            topBtn.style.display = window.scrollY > 300 ? "block" : "none";
        }
    });

    if (topBtn) {
        topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    // 3. الاتصال المباشر بـ API التيك توك وجلب البيانات الفعليه
    const fetchBtn = document.getElementById("fetchBtn");
    const videoUrlInput = document.getElementById("videoUrlInput");
    const loadingStatus = document.getElementById("loadingStatus");
    const statusText = document.getElementById("statusText");
    const videoResult = document.getElementById("videoResult");

    let liveVideoData = null; // تخزين البيانات القادمة من السيرفر

    if (fetchBtn) {
        fetchBtn.addEventListener("click", async () => {
            const videoUrl = videoUrlInput.value.trim();
            if (!videoUrl) {
                alert("الرجاء إدخال رابط فيديو تيك توك صحيح!");
                return;
            }

            loadingStatus.style.display = "flex";
            videoResult.style.display = "none";
            statusText.textContent = "جاري الاتصال بـ السيرفر وجلب البيانات الحقيقية من TikTok...";

            try {
                // طلب البيانات من API حقيقي وفعال مباشرة
                const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(videoUrl)}`;
                const response = await fetch(apiUrl);
                const result = await response.json();

                if (result.code === 0 && result.data) {
                    liveVideoData = result.data;

                    // أ. تحديث معلومات صاحبه الحقيقية
                    document.getElementById("authorName").textContent = liveVideoData.author.nickname || "مستخدم TikTok";
                    document.getElementById("authorHandle").textContent = `@${liveVideoData.author.unique_id}`;
                    document.getElementById("authorAvatar").src = liveVideoData.author.avatar;

                    // ب. تحديث الإحصائيات الحقيقية المباشرة
                    document.getElementById("statViews").textContent = (liveVideoData.play_count || 0).toLocaleString();
                    document.getElementById("statLikes").textContent = (liveVideoData.digg_count || 0).toLocaleString();
                    document.getElementById("statCommentsCount").textContent = (liveVideoData.comment_count || 0).toLocaleString();
                    document.getElementById("statFavorites").textContent = (liveVideoData.collect_count || 0).toLocaleString();
                    document.getElementById("statShares").textContent = (liveVideoData.share_count || 0).toLocaleString();

                    // ج. تشغيل الفيديو المباشر داخل مشغل الموقع
                    const videoPreview = document.getElementById("videoPreview");
                    videoPreview.src = liveVideoData.play;

                    // د. عرض الوصف والتفاصيل المسحوبة
                    const detailsList = document.getElementById("detailsList");
                    detailsList.innerHTML = `
                        <li><strong>📝 وصف الفيديو الحقيقي:</strong> ${liveVideoData.title || "لا يوجد وصف مكتوب"}</li>
                        <li><strong>🎵 الصوت/الموسيقى:</strong> ${liveVideoData.music_info ? liveVideoData.music_info.title : "صوت أصلي"}</li>
                        <li><strong>📍 المنطقة/الدولة:</strong> ${liveVideoData.region || "عام"}</li>
                        <li><strong>⏱️ مدة الفيديو:</strong> ${liveVideoData.duration ? liveVideoData.duration + " ثانية" : "غير معروف"}</li>
                    `;

                    loadingStatus.style.display = "none";
                    videoResult.style.display = "block";
                } else {
                    alert("❌ تعذر جلب بيانات هذا الفيديو! تأكد من أن الرابط صحيح وأن الحساب عام وليس خاصاً.");
                    loadingStatus.style.display = "none";
                }
            } catch (error) {
                console.error("API Error:", error);
                alert("❌ حدث خطأ أثناء الاتصال بالخادم! يرجى إعادة المحاولة أو التأكد من اتصال الإنترنت.");
                loadingStatus.style.display = "none";
            }
        });
    }

    // 4. برمجة الأزرار الخمسة التفاعلية مع البيانات الحقيقية
    document.getElementById("btnNoWatermark").onclick = () => {
        if (liveVideoData && liveVideoData.play) {
            window.open(liveVideoData.play, "_blank");
        }
    };

    document.getElementById("btn4kHdr").onclick = () => {
        if (liveVideoData) {
            const hdUrl = liveVideoData.hdplay || liveVideoData.play;
            window.open(hdUrl, "_blank");
        }
    };

    document.getElementById("btnCopyLink").onclick = () => {
        const urlToCopy = videoUrlInput.value.trim() || window.location.href;
        navigator.clipboard.writeText(urlToCopy);
        alert("📋 تم نسخ رابط الفيديو المباشر إلى الحافظة!");
    };

    document.getElementById("btnWatermark").onclick = () => {
        if (liveVideoData) {
            const wmUrl = liveVideoData.wmplay || liveVideoData.play;
            window.open(wmUrl, "_blank");
        }
    };

    document.getElementById("btnFindSimilar").onclick = () => {
        if (liveVideoData && liveVideoData.author) {
            window.open(`https://www.tiktok.com/@${liveVideoData.author.unique_id}`, "_blank");
        }
    };
});

