document.addEventListener("DOMContentLoaded", () => {
  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  const vh = window.innerHeight * 0.01
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty("--vh", `${vh}px`)

  // We listen to the resize event
  window.addEventListener("resize", () => {
    // We execute the same script as before
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty("--vh", `${vh}px`)
  })

  // Fix video loading issues
  const videoElements = document.querySelectorAll("video")
  videoElements.forEach((video) => {
    // Add event listeners to handle loading states
    video.addEventListener("loadstart", function () {
      this.classList.add("loading")
    })

    video.addEventListener("canplay", function () {
      this.classList.remove("loading")
      this.classList.add("loaded")
    })

    video.addEventListener("error", function () {
      console.error("Error loading video:", this.querySelector("source").src)
      this.classList.add("error")

      // Create error message
      const errorMsg = document.createElement("div")
      errorMsg.className = "video-error-message"
      errorMsg.innerHTML = 'Không thể tải video. <button class="retry-btn">Thử lại</button>'
      this.parentNode.appendChild(errorMsg)

      // Add retry functionality
      errorMsg.querySelector(".retry-btn").addEventListener("click", function () {
        const videoEl = this.parentNode.parentNode.querySelector("video")
        const currentSrc = videoEl.querySelector("source").src
        videoEl.querySelector("source").src = currentSrc
        videoEl.load()
        this.parentNode.remove()
      })
    })

    // Add click-to-load functionality for mobile
    const videoContainer = video.parentNode
    const overlay = videoContainer.querySelector(".video-overlay")

    if (overlay) {
      overlay.addEventListener("click", () => {
        if (!video.classList.contains("loaded")) {
          video.load()
          video.play()
        }
      })
    }
  })

  // Lazy load videos when they come into view
  const lazyLoadVideos = () => {
    const videoContainers = document.querySelectorAll(".video-item")

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    }

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const video = entry.target.querySelector("video")
          if (video && !video.classList.contains("loaded")) {
            // Set poster first for better UX
            if (video.hasAttribute("poster")) {
              const img = new Image()
              img.onload = () => {
                // Once poster is loaded, load video source
                video.load()
              }
              img.src = video.getAttribute("poster")
            } else {
              video.load()
            }
          }
          observer.unobserve(entry.target)
        }
      })
    }, options)

    videoContainers.forEach((container) => {
      observer.observe(container)
    })
  }

  // Initialize lazy loading
  lazyLoadVideos()
})

document.addEventListener("DOMContentLoaded", () => {
  // Mobile Menu Toggle
  const hamburger = document.querySelector(".hamburger")
  const menu = document.querySelector(".menu")

  hamburger.addEventListener("click", function () {
    this.classList.toggle("active")
    menu.classList.toggle("active")
  })

  // Close mobile menu when clicking on a link
  const menuLinks = document.querySelectorAll(".menu a")
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active")
      menu.classList.remove("active")
    })
  })

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        const headerHeight = document.querySelector("header").offsetHeight
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })

  // Tab functionality
  const tabButtons = document.querySelectorAll(".tab-btn")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons and panes
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      document.querySelectorAll(".tab-pane").forEach((pane) => pane.classList.remove("active"))

      // Add active class to clicked button
      this.classList.add("active")

      // Show corresponding tab pane
      const tabId = this.getAttribute("data-tab")
      document.getElementById(tabId).classList.add("active")
    })
  })

  // Form submission
  const contactForm = document.getElementById("contactForm")

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const message = document.getElementById("message").value

      // Simple validation
      if (!name || !email || !message) {
        alert("Vui lòng điền đầy đủ thông tin!")
        return
      }

      // Here you would typically send the form data to a server
      // For now, we'll just show a success message
      alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.")

      // Reset form
      contactForm.reset()
    })
  }

  // Scroll animation for elements
  const scrollElements = document.querySelectorAll(
    ".timeline-item, .case-study-item, .design-item, .content-item, .project-item",
  )

  const elementInView = (el, percentageScroll = 100) => {
    const elementTop = el.getBoundingClientRect().top
    const elementHeight = el.getBoundingClientRect().height
    return elementTop <= (window.innerHeight || document.documentElement.clientHeight) * (percentageScroll / 100)
  }

  const displayScrollElement = (element) => {
    element.classList.add("scrolled")
  }

  const hideScrollElement = (element) => {
    element.classList.remove("scrolled")
  }

  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el, 90)) {
        displayScrollElement(el)
      } else {
        hideScrollElement(el)
      }
    })
  }

  const style = document.createElement("style")
  style.textContent = `
    .timeline-item, .case-study-item, .design-item, .content-item, .project-item {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .timeline-item.scrolled, .case-study-item.scrolled, .design-item.scrolled, .content-item.scrolled, .project-item.scrolled {
        opacity: 1;
        transform: translateY(0);
    }
  `
  document.head.appendChild(style)

  window.addEventListener("scroll", () => {
    handleScrollAnimation()
  })

  // Trigger once on load
  handleScrollAnimation()

  // CSP-compliant TikTok embed handling
  function loadTikTokEmbeds() {
    // Create a new script element for TikTok embed
    const script = document.createElement("script")
    script.src = "https://www.tiktok.com/embed.js"
    script.async = true
    script.defer = true

    document.body.appendChild(script)

    // Add a refresh button for TikTok videos
    const tiktokSection = document.getElementById("tiktok")
    if (tiktokSection) {
      const refreshButton = document.createElement("button")
      refreshButton.textContent = "Tải lại video"
      refreshButton.className = "btn"
      refreshButton.style.display = "block"
      refreshButton.style.margin = "0 auto 20px auto"

      refreshButton.addEventListener("click", () => {
        // Remove old script
        const oldScript = document.querySelector('script[src*="tiktok.com/embed.js"]')
        if (oldScript) {
          oldScript.remove()
        }

        // Create and add new script
        const newScript = document.createElement("script")
        newScript.src = "https://www.tiktok.com/embed.js"
        newScript.async = true
        newScript.defer = true
        document.body.appendChild(newScript)
      })

      // Insert button after the section title
      const sectionTitle = tiktokSection.querySelector(".section-title")
      if (sectionTitle) {
        sectionTitle.insertAdjacentElement("afterend", refreshButton)
      }
    }
  }

  // Load TikTok embeds
  // loadTikTokEmbeds()

  // Handle visibility changes
  // document.addEventListener("visibilitychange", () => {
  //   if (document.visibilityState === "visible") {
  //     // Reload TikTok embeds when tab becomes visible again
  //     const oldScript = document.querySelector('script[src*="tiktok.com/embed.js"]')
  //     if (oldScript) {
  //       oldScript.remove()
  //     }

  //     const newScript = document.createElement("script")
  //     newScript.src = "https://www.tiktok.com/embed.js"
  //     newScript.async = true
  //     newScript.defer = true
  //     document.body.appendChild(newScript)
  //   }
  // })
})

// Smooth scroll for certificates
document.addEventListener("DOMContentLoaded", () => {
  const certificatesSlider = document.querySelector(".certificates-slider")
  let isScrolling = false
  let startX
  let scrollLeft

  certificatesSlider.addEventListener("mousedown", (e) => {
    isScrolling = true
    startX = e.pageX - certificatesSlider.offsetLeft
    scrollLeft = certificatesSlider.scrollLeft
  })

  certificatesSlider.addEventListener("mouseleave", () => {
    isScrolling = false
  })

  certificatesSlider.addEventListener("mouseup", () => {
    isScrolling = false
  })

  certificatesSlider.addEventListener("mousemove", (e) => {
    if (!isScrolling) return
    e.preventDefault()
    const x = e.pageX - certificatesSlider.offsetLeft
    const walk = (x - startX) * 2
    certificatesSlider.scrollLeft = scrollLeft - walk
  })
})

document.addEventListener("DOMContentLoaded", () => {
  const certificatesSlider = document.querySelector(".certificates-slider")
  const prevBtn = document.querySelector(".prev-btn")
  const nextBtn = document.querySelector(".next-btn")
  const isScrolling = false
  let startX
  let scrollLeft

  // Existing mouse events...

  // Add scroll button functionality
  if (prevBtn && nextBtn) {
    const scrollAmount = 300 // Adjust scroll amount as needed

    prevBtn.addEventListener("click", () => {
      certificatesSlider.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      })
    })

    nextBtn.addEventListener("click", () => {
      certificatesSlider.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      })
    })

    // Show/hide buttons based on scroll position
    const updateScrollButtons = () => {
      prevBtn.style.opacity = certificatesSlider.scrollLeft <= 0 ? "0.5" : "1"
      prevBtn.style.cursor = certificatesSlider.scrollLeft <= 0 ? "default" : "pointer"

      const maxScroll = certificatesSlider.scrollWidth - certificatesSlider.clientWidth
      nextBtn.style.opacity = certificatesSlider.scrollLeft >= maxScroll ? "0.5" : "1"
      nextBtn.style.cursor = certificatesSlider.scrollLeft >= maxScroll ? "default" : "pointer"
    }

    certificatesSlider.addEventListener("scroll", updateScrollButtons)
    window.addEventListener("resize", updateScrollButtons)

    // Initial button state
    updateScrollButtons()
  }
})

// Video Modal Functionalit
function playVideo(thumbnailElement, videoUrl) {
  const wrapper = thumbnailElement.parentElement;
  const iframe = wrapper.querySelector('iframe');

  // Hiển thị iframe và set source
  iframe.style.display = 'block';
  iframe.src = videoUrl;

  // Ẩn thumbnail
  thumbnailElement.style.display = 'none';
}


function replaceWithIframe(thumbnailElement, videoUrl) {
  if (!videoUrl) return;

  const iframe = document.createElement('iframe');
  iframe.src = videoUrl;
  iframe.width = "100%";
  iframe.height = "100%";
  iframe.frameBorder = "0";
  iframe.allowFullscreen = true;
  iframe.allow = "autoplay";

  // Replace thumbnail with iframe
  const wrapper = thumbnailElement.parentElement;
  wrapper.innerHTML = ''; // Clear thumbnail
  wrapper.appendChild(iframe);
}

// PDF.js modal preview
window.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("pdfModal")
  const canvas = document.getElementById("pdfCanvas")
  const nativeViewer = document.getElementById("pdfNativeViewer")
  const openButtons = document.querySelectorAll(".pdf-open-btn")

  if (!modal || !canvas || !openButtons.length) return

  const context = canvas.getContext("2d")
  const titleElement = document.getElementById("pdfModalTitle")
  const pageElement = modal.querySelector("[data-pdf-page]")
  const totalElement = modal.querySelector("[data-pdf-total]")
  const statusElement = modal.querySelector("[data-pdf-status]")
  const sourceLink = modal.querySelector("[data-pdf-download]")
  const prevButton = modal.querySelector("[data-pdf-prev]")
  const nextButton = modal.querySelector("[data-pdf-next]")
  const pdfCache = new Map()

  let pdfDocument = null
  let pageNumber = 1
  let isRendering = false
  let nativeMode = false

  const setStatus = (message) => {
    if (statusElement) statusElement.textContent = message || ""
  }

  const updateButtons = () => {
    const totalPages = pdfDocument?.numPages || 1
    if (pageElement) pageElement.textContent = pageNumber
    if (totalElement) totalElement.textContent = totalPages
    if (prevButton) prevButton.disabled = pageNumber <= 1
    if (nextButton) nextButton.disabled = pageNumber >= totalPages
  }

  const showNativePreview = (source, message) => {
    nativeMode = true
    pdfDocument = null
    canvas.classList.add("is-hidden")
    if (nativeViewer) {
      nativeViewer.classList.add("is-visible")
      nativeViewer.innerHTML = ""

      if (window.PDFObject) {
        window.PDFObject.embed(source, nativeViewer, {
          height: "72vh",
          pdfOpenParams: { view: "FitH", toolbar: 1, navpanes: 0 },
        })
      } else {
        const object = document.createElement("object")
        object.data = source
        object.type = "application/pdf"
        object.height = "100%"
        const message = document.createElement("p")
        message.textContent = "Trình duyệt không mở được preview. "
        const link = document.createElement("a")
        link.href = source
        link.target = "_blank"
        link.rel = "noopener"
        link.textContent = "Mở file gốc"
        message.appendChild(link)
        object.appendChild(message)
        nativeViewer.appendChild(object)
      }
    }
    if (prevButton) prevButton.disabled = true
    if (nextButton) nextButton.disabled = true
    if (pageElement) pageElement.textContent = "-"
    if (totalElement) totalElement.textContent = "-"
    setStatus(message || "Đang dùng PDFObject/native PDF viewer trong modal.")
  }

  const renderPage = async (number) => {
    if (!pdfDocument || isRendering || nativeMode) return
    isRendering = true
    setStatus("Đang render PDF...")

    try {
      const page = await pdfDocument.getPage(number)
      const containerWidth = Math.min(modal.querySelector(".pdf-modal__viewer").clientWidth - 44, 980)
      const initialViewport = page.getViewport({ scale: 1 })
      const scale = Math.max(0.8, containerWidth / initialViewport.width)
      const viewport = page.getViewport({ scale })

      canvas.width = viewport.width
      canvas.height = viewport.height
      await page.render({ canvasContext: context, viewport }).promise
      setStatus("")
      updateButtons()
    } catch (error) {
      showNativePreview(sourceLink.href, "PDF.js không render được file này, chuyển sang PDFObject/native viewer.")
    } finally {
      isRendering = false
    }
  }

  const openModal = async (source, title) => {
    modal.classList.add("is-open")
    modal.setAttribute("aria-hidden", "false")
    document.body.classList.add("pdf-modal-open")
    nativeMode = false
    canvas.classList.remove("is-hidden")
    if (nativeViewer) {
      nativeViewer.innerHTML = ""
      nativeViewer.classList.remove("is-visible")
    }
    if (titleElement) titleElement.textContent = title || "Tài liệu"
    if (sourceLink) sourceLink.href = source
    setStatus("Đang tải PDF...")

    try {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"
        const loadingTask = pdfCache.get(source) || window.pdfjsLib.getDocument({ url: source, disableStream: false, disableAutoFetch: false }).promise
        pdfCache.set(source, loadingTask)
        pdfDocument = await loadingTask
        pageNumber = 1
        updateButtons()
        renderPage(pageNumber)
      } else {
        throw new Error("PDF.js unavailable")
      }
    } catch (error) {
      showNativePreview(source, "PDF.js không tải được, chuyển sang PDFObject/native viewer.")
    }
  }

  const closeModal = () => {
    modal.classList.remove("is-open")
    modal.setAttribute("aria-hidden", "true")
    document.body.classList.remove("pdf-modal-open")
    pdfDocument = null
    nativeMode = false
    if (nativeViewer) {
      nativeViewer.innerHTML = ""
      nativeViewer.classList.remove("is-visible")
    }
    canvas.classList.remove("is-hidden")
    context.clearRect(0, 0, canvas.width, canvas.height)
  }

  openButtons.forEach((button) => {
    button.addEventListener("click", () => openModal(button.dataset.pdf, button.dataset.title))
    button.addEventListener("mouseenter", () => {
      if (!window.pdfjsLib || !button.dataset.pdf || pdfCache.has(button.dataset.pdf)) return
      pdfCache.set(button.dataset.pdf, window.pdfjsLib.getDocument({ url: button.dataset.pdf, disableStream: false, disableAutoFetch: false }).promise)
    }, { once: true })
  })

  modal.querySelectorAll("[data-pdf-close]").forEach((button) => {
    button.addEventListener("click", closeModal)
  })

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      if (pageNumber <= 1) return
      pageNumber -= 1
      renderPage(pageNumber)
    })
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      if (!pdfDocument || pageNumber >= pdfDocument.numPages) return
      pageNumber += 1
      renderPage(pageNumber)
    })
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) closeModal()
  })
})
