"use client"

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
} from "react"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Download,
  Loader,
  Upload,
  Save,
  ArrowLeft,
  Palette,
  User,
  GraduationCap,
  Image as ImageIcon,
  CalendarDays,
  Sparkles,
  CheckCircle2,
  Smartphone,
} from "lucide-react"

import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { QRCodeSVG } from "qrcode.react"

interface CollegeIDCard {
  firstName: string
  lastName: string
  rollNumber: string
  dateOfBirth: string
  bloodGroup: string
  phone: string
  department: string
  address: string
  collegeName: string
  collegeAddress: string
  collegePhone: string
  collegeLogo: string
  photo: string
  validTill: string
  cardColor: string
  textColor: string
}

const INITIAL_CARD: CollegeIDCard = {
  firstName: "",
  lastName: "",
  rollNumber: "",
  dateOfBirth: "",
  bloodGroup: "O+",
  phone: "",
  department: "",
  address: "",
  collegeName: "",
  collegeAddress: "",
  collegePhone: "",
  collegeLogo: "",
  photo: "",
  validTill: "2027",
  cardColor: "#2563EB",
  textColor: "#FFFFFF",
}

/* ============================================================
   COLOR HELPERS
============================================================ */

function isUnsafeColor(value: string) {
  const lower = value.toLowerCase().replace(/\s+/g, "")

  return (
    lower.includes("lab(") ||
    lower.includes("oklab(") ||
    lower.includes("lch(") ||
    lower.includes("oklch(") ||
    lower.includes("color-mix(") ||
    lower.includes("color(")
  )
}

function getSafeStyleValue(
  property: string,
  value: string,
  element: Element,
) {
  const normalizedProperty = property.toLowerCase()

  if (normalizedProperty.startsWith("--")) {
    return null
  }

  if (!isUnsafeColor(value)) {
    return value
  }

  if (
    normalizedProperty === "color" ||
    normalizedProperty.includes("text-fill-color") ||
    normalizedProperty === "caret-color"
  ) {
    return "#ffffff"
  }

  if (
    normalizedProperty === "background" ||
    normalizedProperty === "background-color" ||
    normalizedProperty === "background-image"
  ) {
    return "#2563eb"
  }

  if (
    normalizedProperty.includes("border") ||
    normalizedProperty === "outline-color" ||
    normalizedProperty === "text-decoration-color" ||
    normalizedProperty === "column-rule-color"
  ) {
    return "#ffffff"
  }

  if (normalizedProperty === "fill") {
    return element.tagName.toLowerCase() === "svg"
      ? "#000000"
      : "#ffffff"
  }

  if (normalizedProperty === "stroke") {
    return "#000000"
  }

  if (
    normalizedProperty === "box-shadow" ||
    normalizedProperty === "text-shadow"
  ) {
    return "none"
  }

  return "transparent"
}

/* ============================================================
   CARD COLOR HELPERS
============================================================ */

function normalizeHexColor(value?: string | null) {
  const trimmed = (value ?? "").trim()

  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
    return trimmed.toUpperCase()
  }

  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    return (
      "#" +
      trimmed
        .slice(1)
        .split("")
        .map((char) => char + char)
        .join("")
    ).toUpperCase()
  }

  return "#2563EB"
}

function normalizeTextColor(value?: string | null) {
  const normalized = normalizeHexColor(value)

  return normalized === "#2563EB" && value !== "#2563EB"
    ? "#FFFFFF"
    : normalized
}

function hexToRgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function hexToRgb(hex: string) {
  const normalized = normalizeHexColor(hex)

  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16),
  }
}

function rgbToHex(r: number, g: number, b: number) {
  const clamp = (value: number) =>
    Math.max(0, Math.min(255, Math.round(value)))

  return (
    "#" +
    [clamp(r), clamp(g), clamp(b)]
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("")
  ).toUpperCase()
}

function shadeColor(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex)

  return rgbToHex(
    r + (amount > 0 ? (255 - r) * amount : r * amount),
    g + (amount > 0 ? (255 - g) * amount : g * amount),
    b + (amount > 0 ? (255 - b) * amount : b * amount),
  )
}

/* ============================================================
   COMPONENT
============================================================ */

function Page() {
  const router = useRouter()

  const [card, setCard] =
    useState<CollegeIDCard>(INITIAL_CARD)

  const [cardId, setCardId] =
    useState<string | null>(null)

  const [loadingCard, setLoadingCard] =
    useState(false)

  const [saving, setSaving] =
    useState(false)

  const [exporting, setExporting] =
    useState(false)

  const [exportError, setExportError] =
    useState<string | null>(null)

  const [saveMessage, setSaveMessage] =
    useState<string | null>(null)

  const [rotate, setRotate] = useState({
    x: 0,
    y: 0,
  })

  const [isHovering, setIsHovering] =
    useState(false)

  const cardRef =
    useRef<HTMLDivElement>(null)

  const photoInputRef =
    useRef<HTMLInputElement>(null)

  const logoInputRef =
    useRef<HTMLInputElement>(null)

  /* ==========================================================
     LOAD EXISTING CARD
  ========================================================== */

  useEffect(() => {
    let cancelled = false

    async function loadExistingCard() {
      const searchParams =
        new URLSearchParams(
          window.location.search,
        )

      const id = searchParams.get("id")

      if (!id) {
        return
      }

      setCardId(id)
      setLoadingCard(true)
      setExportError(null)

      try {
        const response = await fetch(
          `/api/cards/${id}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          },
        )

        const data =
          await response.json().catch(() => null)

        if (!response.ok) {
          throw new Error(
            data?.error ||
              data?.message ||
              "Failed to load ID card.",
          )
        }

        if (cancelled) {
          return
        }

        setCard({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          rollNumber: data.rollNumber || "",
          dateOfBirth: data.dateOfBirth || "",
          bloodGroup: data.bloodGroup || "O+",
          phone: data.phone || "",
          department:
            data.department ||
            data.title ||
            "",
          address: data.address || "",
          collegeName:
            data.collegeName ||
            data.company ||
            "",
          collegeAddress:
            data.collegeAddress || "",
          collegePhone:
            data.collegePhone || "",
          collegeLogo:
            data.collegeLogo || "",
          photo: data.photo || "",
          validTill:
            data.validTill || "2027",
          cardColor: normalizeHexColor(
            data.cardColor ||
              data.designJson?.colors
                ?.primary ||
              "#2563EB",
          ),
          textColor: normalizeTextColor(
            data.textColor ||
              data.designJson?.colors
                ?.text ||
              "#FFFFFF",
          ),
        })
      } catch (error) {
        console.error(
          "Error loading ID card:",
          error,
        )

        if (!cancelled) {
          setExportError(
            error instanceof Error
              ? error.message
              : "Failed to load ID card.",
          )
        }
      } finally {
        if (!cancelled) {
          setLoadingCard(false)
        }
      }
    }

    loadExistingCard()

    return () => {
      cancelled = true
    }
  }, [])

  /* ==========================================================
     UPDATE CARD
  ========================================================== */

  function updateCard<
    K extends keyof CollegeIDCard,
  >(
    field: K,
    value: CollegeIDCard[K],
  ) {
    setCard((previous) => ({
      ...previous,
      [field]: value,
    }))

    setExportError(null)
    setSaveMessage(null)
  }

  /* ==========================================================
     IMAGE UPLOAD
  ========================================================== */

  function readImageFile(
    file: File,
    callback: (result: string) => void,
  ) {
    if (!file.type.startsWith("image/")) {
      setExportError(
        "Please select a valid image file.",
      )
      return
    }

    const reader =
      new FileReader()

    reader.onload = (event) => {
      const result =
        event.target?.result

      if (typeof result === "string") {
        callback(result)
        setExportError(null)
        setSaveMessage(null)
      }
    }

    reader.onerror = () => {
      setExportError(
        "Failed to read the selected image.",
      )
    }

    reader.readAsDataURL(file)
  }

  function handlePhotoUpload(
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      e.target.files?.[0]

    if (!file) return

    readImageFile(file, (result) => {
      updateCard("photo", result)
    })

    e.target.value = ""
  }

  function handleLogoUpload(
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      e.target.files?.[0]

    if (!file) return

    readImageFile(file, (result) => {
      updateCard("collegeLogo", result)
    })

    e.target.value = ""
  }

  /* ==========================================================
     SAVE CARD
  ========================================================== */

  async function handleSaveCard() {
    if (saving) return

    setExportError(null)
    setSaveMessage(null)

    if (!card.firstName.trim()) {
      setExportError(
        "Please enter the first name.",
      )
      return
    }

    if (!card.lastName.trim()) {
      setExportError(
        "Please enter the last name.",
      )
      return
    }

    if (!card.rollNumber.trim()) {
      setExportError(
        "Please enter the roll number.",
      )
      return
    }

    if (!card.dateOfBirth.trim()) {
      setExportError(
        "Please enter the date of birth.",
      )
      return
    }

    if (!card.department.trim()) {
      setExportError(
        "Please enter the department / branch.",
      )
      return
    }

    if (!card.phone.trim()) {
      setExportError(
        "Please enter the phone number.",
      )
      return
    }

    if (!card.address.trim()) {
      setExportError(
        "Please enter the address.",
      )
      return
    }

    if (!card.collegeName.trim()) {
      setExportError(
        "Please enter the college name.",
      )
      return
    }

    if (!card.collegeAddress.trim()) {
      setExportError(
        "Please enter the college address.",
      )
      return
    }

    if (!card.collegePhone.trim()) {
      setExportError(
        "Please enter the college telephone.",
      )
      return
    }

    if (!card.photo) {
      setExportError(
        "Please upload the student photo.",
      )
      return
    }

    setSaving(true)

    try {
      const payload = {
        firstName:
          card.firstName.trim(),

        lastName:
          card.lastName.trim(),

        title:
          card.department.trim(),

        company:
          card.collegeName.trim(),

        rollNumber:
          card.rollNumber.trim(),

        dateOfBirth:
          card.dateOfBirth.trim(),

        bloodGroup:
          card.bloodGroup,

        phone:
          card.phone.trim(),

        department:
          card.department.trim(),

        address:
          card.address.trim(),

        collegeName:
          card.collegeName.trim(),

        collegeAddress:
          card.collegeAddress.trim(),

        collegePhone:
          card.collegePhone.trim(),

        collegeLogo:
          card.collegeLogo,

        photo:
          card.photo,

        validTill:
          card.validTill.trim(),

        cardColor:
          normalizeHexColor(
            card.cardColor,
          ),

        textColor:
          normalizeTextColor(
            card.textColor,
          ),
      }

      const url = cardId
        ? `/api/cards/${cardId}`
        : "/api/cards"

      const method = cardId
        ? "PUT"
        : "POST"

      const response =
        await fetch(url, {
          method,
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials:
            "include",
          body: JSON.stringify(
            payload,
          ),
        })

      const data =
        await response
          .json()
          .catch(() => null)

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            `Failed to ${
              cardId
                ? "update"
                : "save"
            } ID card.`,
        )
      }

      if (!cardId && data?._id) {
        setCardId(
          String(data._id),
        )
      }

      setSaveMessage(
        cardId
          ? "ID Card updated successfully!"
          : "ID Card saved successfully!",
      )

      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 700)
    } catch (error) {
      console.error(
        "Save/update ID card error:",
        error,
      )

      setExportError(
        error instanceof Error
          ? error.message
          : "Failed to save ID card.",
      )
    } finally {
      setSaving(false)
    }
  }

  /* ==========================================================
     CARD 3D EFFECT
  ========================================================== */

  function handleCardMouseEnter() {
    if (exporting || saving) return

    setIsHovering(true)
  }

  function handleCardMouseMove(
    e: MouseEvent<HTMLDivElement>,
  ) {
    if (
      exporting ||
      saving ||
      !isHovering ||
      !cardRef.current
    ) {
      return
    }

    const rect =
      cardRef.current.getBoundingClientRect()

    const x =
      e.clientX - rect.left

    const y =
      e.clientY - rect.top

    const centerX =
      rect.width / 2

    const centerY =
      rect.height / 2

    setRotate({
      x:
        (y - centerY) / 20,
      y:
        (centerX - x) / 20,
    })
  }

  function handleCardMouseLeave() {
    setIsHovering(false)

    setRotate({
      x: 0,
      y: 0,
    })
  }

  /* ==========================================================
     WAIT FOR IMAGES
  ========================================================== */

  async function waitForImages(
    element: HTMLElement,
  ) {
    const images =
      Array.from(
        element.querySelectorAll(
          "img",
        ),
      )

    await Promise.all(
      images.map(
        (image) =>
          new Promise<void>(
            (resolve) => {
              if (image.complete) {
                resolve()
                return
              }

              const finish =
                () => resolve()

              image.addEventListener(
                "load",
                finish,
                {
                  once: true,
                },
              )

              image.addEventListener(
                "error",
                finish,
                {
                  once: true,
                },
              )
            },
          ),
      ),
    )
  }

  /* ==========================================================
     PREPARE HTML2CANVAS CLONE
  ========================================================== */

  function sanitizeCloneStyles(
    clonedDoc: Document,
  ) {
    const colorFallback =
      "transparent"

    const replaceUnsupportedColors = (
      cssText: string,
    ) =>
      cssText
        .replace(
          /oklch\([^)]*\)/gi,
          colorFallback,
        )
        .replace(
          /oklab\([^)]*\)/gi,
          colorFallback,
        )
        .replace(
          /lch\([^)]*\)/gi,
          colorFallback,
        )
        .replace(
          /lab\([^)]*\)/gi,
          colorFallback,
        )
        .replace(
          /color-mix\([^)]*\)/gi,
          colorFallback,
        )
        .replace(
          /color\([^)]*\)/gi,
          colorFallback,
        )

    const cssChunks: string[] =
      []

    for (const sheet of Array.from(
      document.styleSheets,
    )) {
      try {
        const rules =
          sheet.cssRules

        if (!rules) continue

        for (const rule of Array.from(
          rules,
        )) {
          cssChunks.push(
            rule.cssText,
          )
        }
      } catch {
        // Ignore inaccessible stylesheets.
      }
    }

    clonedDoc
      .querySelectorAll("style")
      .forEach(
        (styleElement) => {
          const cssText =
            styleElement.textContent

          if (cssText) {
            cssChunks.push(
              cssText,
            )
          }
        },
      )

    clonedDoc
      .querySelectorAll(
        'style, link[rel="stylesheet"]',
      )
      .forEach((element) =>
        element.remove(),
      )

    const style =
      clonedDoc.createElement(
        "style",
      )

    style.setAttribute(
      "data-export-safe-styles",
      "true",
    )

    style.textContent =
      replaceUnsupportedColors(
        cssChunks.join("\n"),
      )

    clonedDoc.head.appendChild(
      style,
    )
  }

  /* ==========================================================
     EXPORT CLONE FIX
  ========================================================== */

  function prepareExportClone(
    clonedDoc: Document,
    clonedCard: HTMLElement,
  ) {
    const originalCard =
      cardRef.current

    if (!originalCard) return

    sanitizeCloneStyles(
      clonedDoc,
    )

    const rect =
      originalCard.getBoundingClientRect()

    const exportWidth =
      Math.max(
        1,
        Math.round(rect.width),
      )

    const exportHeight =
      Math.max(
        1,
        Math.round(rect.height),
      )

    /* ========================================================
       CARD SIZE / POSITION
    ======================================================== */

    clonedCard.style.setProperty(
      "width",
      `${exportWidth}px`,
      "important",
    )

    clonedCard.style.setProperty(
      "height",
      `${exportHeight}px`,
      "important",
    )

    clonedCard.style.setProperty(
      "min-width",
      `${exportWidth}px`,
      "important",
    )

    clonedCard.style.setProperty(
      "min-height",
      `${exportHeight}px`,
      "important",
    )

    clonedCard.style.setProperty(
      "max-width",
      `${exportWidth}px`,
      "important",
    )

    clonedCard.style.setProperty(
      "max-height",
      `${exportHeight}px`,
      "important",
    )

    clonedCard.style.setProperty(
      "aspect-ratio",
      "auto",
      "important",
    )

    clonedCard.style.setProperty(
      "transform",
      "none",
      "important",
    )

    clonedCard.style.setProperty(
      "perspective",
      "none",
      "important",
    )

    clonedCard.style.setProperty(
      "overflow",
      "hidden",
      "important",
    )

    clonedCard.style.setProperty(
      "box-sizing",
      "border-box",
      "important",
    )

    clonedCard.style.setProperty(
      "background",
      normalizeHexColor(
        card.cardColor,
      ),
      "important",
    )

    clonedCard.style.setProperty(
      "background-color",
      normalizeHexColor(
        card.cardColor,
      ),
      "important",
    )

    clonedCard.style.setProperty(
      "color",
      normalizeTextColor(
        card.textColor,
      ),
      "important",
    )

    /* ========================================================
       FIND EXPORT ELEMENTS
    ======================================================== */

    const exportContent =
      clonedCard.querySelector(
        "[data-export-content]",
      ) as HTMLElement | null

    const exportIdentity =
      clonedCard.querySelector(
        "[data-export-student-identity]",
      ) as HTMLElement | null

    const exportDetailsGrid =
      clonedCard.querySelector(
        "[data-export-details-grid]",
      ) as HTMLElement | null

    /* ========================================================
       CARD CONTENT
    ======================================================== */

    if (exportContent) {
      exportContent.style.setProperty(
        "display",
        "flex",
        "important",
      )

      exportContent.style.setProperty(
        "flex-direction",
        "column",
        "important",
      )

      exportContent.style.setProperty(
        "width",
        "100%",
        "important",
      )

      exportContent.style.setProperty(
        "height",
        "100%",
        "important",
      )

      exportContent.style.setProperty(
        "min-height",
        "0",
        "important",
      )

      exportContent.style.setProperty(
        "box-sizing",
        "border-box",
        "important",
      )
    }

    /* ========================================================
       STUDENT IDENTITY CENTER FIX
    ======================================================== */

    if (exportIdentity) {
      exportIdentity.style.setProperty(
        "display",
        "flex",
        "important",
      )

      exportIdentity.style.setProperty(
        "flex",
        "1 1 0%",
        "important",
      )

      exportIdentity.style.setProperty(
        "min-height",
        "0",
        "important",
      )

      exportIdentity.style.setProperty(
        "width",
        "100%",
        "important",
      )

      exportIdentity.style.setProperty(
        "flex-direction",
        "column",
        "important",
      )

      exportIdentity.style.setProperty(
        "align-items",
        "center",
        "important",
      )

      exportIdentity.style.setProperty(
        "justify-content",
        "center",
        "important",
      )

      exportIdentity.style.setProperty(
        "text-align",
        "center",
        "important",
      )

      exportIdentity.style.setProperty(
        "box-sizing",
        "border-box",
        "important",
      )
    }

    /* ========================================================
       DETAILS GRID
    ======================================================== */

    if (exportDetailsGrid) {
      exportDetailsGrid.style.setProperty(
        "display",
        "grid",
        "important",
      )

      exportDetailsGrid.style.setProperty(
        "grid-template-columns",
        "repeat(4, minmax(0, 1fr))",
        "important",
      )

      exportDetailsGrid.style.setProperty(
        "gap",
        "6px",
        "important",
      )

      exportDetailsGrid.style.setProperty(
        "width",
        "100%",
        "important",
      )

      exportDetailsGrid.style.setProperty(
        "flex-shrink",
        "0",
        "important",
      )

      exportDetailsGrid.style.setProperty(
        "box-sizing",
        "border-box",
        "important",
      )
    }

    /* ========================================================
       ALL CHILDREN
    ======================================================== */

    clonedCard
      .querySelectorAll<HTMLElement>(
        "*",
      )
      .forEach((element) => {
        element.style.setProperty(
          "transition",
          "none",
          "important",
        )

        element.style.setProperty(
          "animation",
          "none",
          "important",
        )

        element.style.setProperty(
          "filter",
          "none",
          "important",
        )

        element.style.setProperty(
          "backdrop-filter",
          "none",
          "important",
        )

        element.style.setProperty(
          "-webkit-backdrop-filter",
          "none",
          "important",
        )

        const tag =
          element.tagName.toLowerCase()

        /* ======================================================
           DETAIL BOX CONTAINER
        ====================================================== */

        if (
          element.hasAttribute(
            "data-export-detail",
          )
        ) {
          element.style.setProperty(
            "display",
            "flex",
            "important",
          )

          element.style.setProperty(
            "flex-direction",
            "column",
            "important",
          )

          element.style.setProperty(
            "align-items",
            "center",
            "important",
          )

          element.style.setProperty(
            "justify-content",
            "center",
            "important",
          )

          element.style.setProperty(
            "text-align",
            "center",
            "important",
          )

          element.style.setProperty(
            "box-sizing",
            "border-box",
            "important",
          )

          element.style.setProperty(
            "width",
            "100%",
            "important",
          )

          element.style.setProperty(
            "min-width",
            "0",
            "important",
          )

          element.style.setProperty(
            "overflow",
            "hidden",
            "important",
          )

          element.style.setProperty(
            "flex-shrink",
            "0",
            "important",
          )
        }

        /* ======================================================
           TEXT INSIDE DETAIL BOX
        ====================================================== */

        if (
          element.closest(
            "[data-export-detail]",
          ) &&
          (tag === "p" ||
            tag === "span")
        ) {
          element.style.setProperty(
            "display",
            "block",
            "important",
          )

          element.style.setProperty(
            "width",
            "100%",
            "important",
          )

          element.style.setProperty(
            "max-width",
            "100%",
            "important",
          )

          element.style.setProperty(
            "margin-left",
            "0",
            "important",
          )

          element.style.setProperty(
            "margin-right",
            "0",
            "important",
          )

          element.style.setProperty(
            "text-align",
            "center",
            "important",
          )

          element.style.setProperty(
            "overflow",
            "hidden",
            "important",
          )

          element.style.setProperty(
            "text-overflow",
            "clip",
            "important",
          )

          element.style.setProperty(
            "white-space",
            "nowrap",
            "important",
          )

          element.style.setProperty(
            "height",
            "auto",
            "important",
          )

          element.style.setProperty(
            "min-height",
            "0",
            "important",
          )

          element.style.setProperty(
            "max-height",
            "none",
            "important",
          )

          element.style.setProperty(
            "line-height",
            "1.1",
            "important",
          )

          element.style.setProperty(
            "box-sizing",
            "border-box",
            "important",
          )
        }

        /* ======================================================
           GENERAL TEXT SAFETY
        ====================================================== */

        if (
          element.classList.contains(
            "truncate",
          ) ||
          tag === "p" ||
          tag === "h1" ||
          tag === "h2" ||
          tag === "h3" ||
          tag === "span"
        ) {
          element.style.setProperty(
            "overflow",
            "visible",
            "important",
          )

          element.style.setProperty(
            "text-overflow",
            "clip",
            "important",
          )
        }

        if (
          tag === "p" ||
          tag === "h1" ||
          tag === "h2" ||
          tag === "h3"
        ) {
          element.style.setProperty(
            "height",
            "auto",
            "important",
          )

          element.style.setProperty(
            "min-height",
            "0",
            "important",
          )

          element.style.setProperty(
            "max-height",
            "none",
            "important",
          )
        }
      })

    /* ========================================================
       EXPLICIT EXPORT CSS
    ======================================================== */

    const exportTextStyle =
      clonedDoc.createElement(
        "style",
      )

    exportTextStyle.setAttribute(
      "data-export-text-fix",
      "true",
    )

    exportTextStyle.textContent = `
      /* Card content */
      [data-card-export] [data-export-content] {
        display: flex !important;
        flex-direction: column !important;
        width: 100% !important;
        height: 100% !important;
        min-height: 0 !important;
        box-sizing: border-box !important;
      }

      /* Student Identity */
      [data-card-export] [data-export-student-identity] {
        display: flex !important;
        flex: 1 1 0% !important;
        min-height: 0 !important;
        width: 100% !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        text-align: center !important;
        box-sizing: border-box !important;
      }

      [data-card-export] [data-export-student-identity] h2,
      [data-card-export] [data-export-student-identity] p,
      [data-card-export] [data-export-student-identity] span {
        text-align: center !important;
      }

      /* Details Grid */
      [data-card-export] [data-export-details-grid] {
        display: grid !important;
        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
        gap: 6px !important;
        width: 100% !important;
        flex-shrink: 0 !important;
        box-sizing: border-box !important;
      }

      /* Four detail boxes */
      [data-card-export] [data-export-detail] {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
        min-width: 0 !important;
        flex-shrink: 0 !important;
        text-align: center !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
      }

      /* Detail text */
      [data-card-export] [data-export-detail] p,
      [data-card-export] [data-export-detail] span {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        text-align: center !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: clip !important;
        line-height: 1.1 !important;
        height: auto !important;
        min-height: 0 !important;
        max-height: none !important;
        box-sizing: border-box !important;
      }

      [data-card-export] [data-export-detail] p + p {
        margin-top: 2px !important;
      }

      /* Keep exported card headings/text sane */
      [data-card-export] h1,
      [data-card-export] h2,
      [data-card-export] h3,
      [data-card-export] p,
      [data-card-export] span {
        box-sizing: border-box !important;
      }
    `

    clonedDoc.head.appendChild(
      exportTextStyle,
    )

    /* ========================================================
       IMAGES
    ======================================================== */

    const originalImages =
      Array.from(
        originalCard.querySelectorAll(
          "img",
        ),
      )

    const clonedImages =
      Array.from(
        clonedCard.querySelectorAll(
          "img",
        ),
      )

    originalImages.forEach(
      (
        originalImage,
        index,
      ) => {
        const clonedImage =
          clonedImages[index]

        if (!clonedImage) return

        clonedImage.crossOrigin =
          "anonymous"

        clonedImage.removeAttribute(
          "loading",
        )

        clonedImage.src =
          originalImage.src
      },
    )

    /* ========================================================
       SVG
    ======================================================== */

    clonedCard
      .querySelectorAll<SVGElement>(
        "svg",
      )
      .forEach((svg) => {
        svg.style.setProperty(
          "display",
          "block",
          "important",
        )

        svg.style.setProperty(
          "max-width",
          "none",
          "important",
        )

        svg.style.setProperty(
          "max-height",
          "none",
          "important",
        )

        svg.style.setProperty(
          "overflow",
          "visible",
          "important",
        )
      })
  }

  /* ==========================================================
     EXPORT
  ========================================================== */

  async function handleExport(
    format: "png" | "pdf",
  ) {
    if (exporting || saving) {
      return
    }

    if (!cardRef.current) {
      setExportError(
        "Card preview not found.",
      )
      return
    }

    if (!card.rollNumber.trim()) {
      setExportError(
        "Please enter a roll number before exporting.",
      )
      return
    }

    setExporting(true)
    setExportError(null)

    try {
      setIsHovering(false)

      setRotate({
        x: 0,
        y: 0,
      })

      await new Promise<void>(
        (resolve) => {
          requestAnimationFrame(
            () => {
              requestAnimationFrame(
                () => {
                  resolve()
                },
              )
            },
          )
        },
      )

      const cardElement =
        cardRef.current

      if (!cardElement) {
        throw new Error(
          "Card preview not found.",
        )
      }

      if ("fonts" in document) {
        await document.fonts.ready
      }

      await waitForImages(
        cardElement,
      )

      const canvas =
        await html2canvas(
          cardElement,
          {
            scale: 4,
            useCORS: true,
            allowTaint: false,
            backgroundColor:
              normalizeHexColor(
                card.cardColor,
              ),
            logging: false,
            imageTimeout: 20000,
            removeContainer: true,
            foreignObjectRendering: false,

            onclone: (
              clonedDoc,
            ) => {
              const clonedCard =
                clonedDoc.querySelector(
                  "[data-card-export]",
                ) as HTMLElement | null

              if (!clonedCard) {
                return
              }

              prepareExportClone(
                clonedDoc,
                clonedCard,
              )
            },
          },
        )

      if (
        !canvas ||
        canvas.width <= 0 ||
        canvas.height <= 0
      ) {
        throw new Error(
          "Failed to capture the ID card.",
        )
      }

      const safeRollNumber =
        card.rollNumber
          .trim()
          .replace(
            /[^a-zA-Z0-9_-]/g,
            "_",
          )

      const fileName =
        `College_ID_${safeRollNumber}`

      /* ========================================================
         PNG
      ======================================================== */

      if (format === "png") {
        const blob =
          await new Promise<Blob | null>(
            (resolve) => {
              canvas.toBlob(
                resolve,
                "image/png",
                1,
              )
            },
          )

        if (!blob) {
          throw new Error(
            "Failed to create PNG.",
          )
        }

        const url =
          URL.createObjectURL(
            blob,
          )

        const link =
          document.createElement(
            "a",
          )

        link.href = url

        link.download =
          `${fileName}.png`

        document.body.appendChild(
          link,
        )

        link.click()

        link.remove()

        setTimeout(() => {
          URL.revokeObjectURL(
            url,
          )
        }, 1000)

        return
      }

      /* ========================================================
         PDF
      ======================================================== */

      const imgData =
        canvas.toDataURL(
          "image/png",
          1,
        )

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [85.6, 53.98],
        compress: true,
      })

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        85.6,
        53.98,
        undefined,
        "FAST",
      )

      pdf.save(
        `${fileName}.pdf`,
      )
    } catch (error) {
      console.error(
        "ID card export error:",
        error,
      )

      setExportError(
        error instanceof Error
          ? error.message
          : "Unknown export error.",
      )
    } finally {
      setExporting(false)
    }
  }

  /* ==========================================================
     STYLES
  ========================================================== */

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-sm font-medium text-white shadow-inner shadow-black/5 outline-none placeholder:text-slate-500 transition-all duration-200 focus:border-blue-400/50 focus:bg-white/[0.09] focus:ring-4 focus:ring-blue-500/10"

  const labelClass =
    "mb-2 block text-[13px] font-semibold text-slate-200"

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070b14] text-white">
      {/* ================================================
          AMBIENT BACKGROUND
      ================================================ */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-blue-600/15 blur-[120px]" />

        <div className="absolute left-[35%] top-[25%] h-[22rem] w-[22rem] rounded-full bg-indigo-500/10 blur-[120px]" />

        <div className="absolute -bottom-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-cyan-500/10 blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)",
            backgroundSize:
              "42px 42px",
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(30,41,59,0.35),transparent_45%)]" />
      </div>

      {/* ================================================
          LOADING
      ================================================ */}

      {loadingCard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-md">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="flex w-full max-w-sm items-center justify-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 px-5 py-4 text-sm font-bold text-white shadow-2xl backdrop-blur-xl sm:w-auto"
          >
            <Loader
              size={20}
              className="animate-spin text-blue-400"
            />

            Loading your ID card...
          </motion.div>
        </div>
      )}

      {/* ================================================
          HEADER
      ================================================ */}

      <motion.nav
        className="sticky top-0 z-40 border-b border-white/[0.07] bg-slate-950/65 shadow-lg shadow-black/10 backdrop-blur-2xl"
        initial={{
          opacity: 0,
          y: -18,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.55,
        }}
      >
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:h-[76px] sm:px-6 lg:px-8">
          <motion.button
            type="button"
            onClick={() =>
              router.back()
            }
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-2.5 py-2 text-sm font-semibold text-slate-400 transition-all hover:border-white/10 hover:bg-white/[0.06] hover:text-white"
            whileHover={{
              x: -2,
            }}
            whileTap={{
              scale: 0.98,
            }}
          >
            <ArrowLeft size={17} />

            <span className="hidden xs:inline">
              Back
            </span>
          </motion.button>

          <div className="min-w-0 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-400/20 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/10">
                <Smartphone size={14} />
              </div>

              <h1 className="truncate text-sm font-black tracking-tight text-white sm:text-xl">
                College ID Card Generator
              </h1>
            </div>

            <p className="mt-0.5 hidden text-xs font-medium text-slate-500 sm:block">
              {cardId
                ? "Edit your student ID card"
                : "Create a professional student ID card"}
            </p>
          </div>

          <div className="w-[52px] sm:w-[76px]" />
        </div>
      </motion.nav>

      {/* ================================================
          MAIN
      ================================================ */}

      <main className="relative z-10 mx-auto max-w-7xl px-3 py-5 sm:px-5 sm:py-7 lg:px-8 lg:py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:items-start lg:gap-8 xl:gap-10">
          {/* ==========================================
              PREVIEW
          ========================================== */}

          <motion.section
            className="self-start lg:col-span-2"
            initial={{
              opacity: 0,
              x: -24,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            <div className="lg:sticky lg:top-[92px] lg:self-start">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <div className="mb-1.5 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-blue-400">
                    <Sparkles size={12} />
                    Live Preview
                  </div>

                  <h2 className="text-2xl font-black tracking-tight text-white">
                    Your Student ID
                  </h2>
                </div>

                <div className="hidden rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 shadow-sm sm:block">
                  85.6 × 53.98 mm
                </div>
              </div>

              {/* PREVIEW GLASS */}
              <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-4">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_35%)]" />

                <div className="absolute left-5 top-5 z-10 rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur-md">
                  Preview
                </div>

                <div className="relative mx-auto w-full max-w-[600px] [perspective:1000px]">
                  <div
                    ref={cardRef}
                    data-card-export
                    onMouseEnter={
                      handleCardMouseEnter
                    }
                    onMouseMove={
                      handleCardMouseMove
                    }
                    onMouseLeave={
                      handleCardMouseLeave
                    }
                    className="relative w-full overflow-hidden rounded-2xl"
                    style={{
                      aspectRatio:
                        "85.6 / 53.98",
                      backgroundColor:
                        normalizeHexColor(
                          card.cardColor,
                        ),
                      boxShadow:
                        "0 30px 70px rgba(0,0,0,0.32), 0 8px 20px rgba(15,23,42,0.18)",
                      transform:
                        isHovering
                          ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(1.02)`
                          : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
                      transition:
                        "transform 300ms ease",
                    }}
                  >
                    {/* Card background */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          `linear-gradient(135deg, ${normalizeHexColor(
                            card.cardColor,
                          )} 0%, ${shadeColor(
                            card.cardColor,
                            -0.18,
                          )} 55%, ${shadeColor(
                            card.cardColor,
                            -0.32,
                          )} 100%)`,
                      }}
                    />

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_15%_90%,rgba(255,255,255,0.10),transparent_28%)]" />

                    <div
                      className="absolute -right-20 -top-20 h-52 w-52 rounded-full"
                      style={{
                        background:
                          "rgba(255,255,255,0.08)",
                      }}
                    />

                    <div
                      className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full"
                      style={{
                        background:
                          "rgba(255,255,255,0.06)",
                      }}
                    />

                    {/* CARD CONTENT */}
                    <div
                      data-export-content
                      className="relative flex h-full w-full flex-col p-[4%]"
                      style={{
                        fontSize: "11px",
                        color:
                          normalizeTextColor(
                            card.textColor,
                          ),
                      }}
                    >
                      {/* COLLEGE HEADER */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 flex-1 items-center gap-2.5">
                          {card.collegeLogo ? (
                            <img
                              src={
                                card.collegeLogo
                              }
                              alt="College Logo"
                              crossOrigin="anonymous"
                              className="h-9 w-9 shrink-0 rounded-full border border-white/60 bg-white p-1 object-contain shadow-md"
                            />
                          ) : (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/15 text-[7px] font-black backdrop-blur-sm">
                              LOGO
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <p
                              className="truncate font-black uppercase tracking-wide"
                              style={{
                                fontSize:
                                  "9px",
                                color:
                                  normalizeTextColor(
                                    card.textColor,
                                  ),
                              }}
                            >
                              {card.collegeName ||
                                "College Name"}
                            </p>

                            <p
                              className="mt-0.5 truncate"
                              style={{
                                fontSize:
                                  "6.5px",
                                color:
                                  hexToRgba(
                                    normalizeTextColor(
                                      card.textColor,
                                    ),
                                    0.78,
                                  ),
                              }}
                            >
                              {card.collegeAddress ||
                                "College Address"}
                            </p>

                            <p
                              className="truncate"
                              style={{
                                fontSize:
                                  "6.5px",
                                color:
                                  hexToRgba(
                                    normalizeTextColor(
                                      card.textColor,
                                    ),
                                    0.78,
                                  ),
                              }}
                            >
                              {card.collegePhone ||
                                "College Contact"}
                            </p>
                          </div>
                        </div>

                        {card.photo ? (
                          <img
                            src={card.photo}
                            alt="Student"
                            crossOrigin="anonymous"
                            className="h-14 w-11 shrink-0 rounded-md border border-white/80 bg-white/10 object-cover shadow-lg"
                          />
                        ) : (
                          <div className="flex h-14 w-11 shrink-0 items-center justify-center rounded-md border border-white/60 bg-white/10 text-center text-[6.5px] font-black backdrop-blur-sm">
                            PHOTO
                          </div>
                        )}
                      </div>

                      {/* STUDENT IDENTITY */}
                      <div
                        data-export-student-identity
                        className="flex min-h-0 flex-1 flex-col items-center justify-center py-2 text-center"
                      >
                        <div className="mb-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 backdrop-blur-sm">
                          <span
                            className="font-black uppercase tracking-[0.18em]"
                            style={{
                              fontSize:
                                "6px",
                              color:
                                hexToRgba(
                                  normalizeTextColor(
                                    card.textColor,
                                  ),
                                  0.9,
                                ),
                            }}
                          >
                            Student ID Card
                          </span>
                        </div>

                        <h2
                          className="max-w-[80%] truncate text-center font-black uppercase"
                          style={{
                            fontSize:
                              "15px",
                            color:
                              normalizeTextColor(
                                card.textColor,
                              ),
                          }}
                        >
                          {card.firstName ||
                            "First Name"}{" "}
                          {card.lastName}
                        </h2>

                        <p
                          className="mt-0.5 max-w-[85%] truncate text-center font-semibold"
                          style={{
                            fontSize:
                              "8px",
                            color:
                              hexToRgba(
                                normalizeTextColor(
                                  card.textColor,
                                ),
                                0.86,
                              ),
                          }}
                        >
                          {card.department ||
                            "Computer Science & Engineering"}
                        </p>

                        <p
                          className="mt-1 text-center font-medium uppercase tracking-wider"
                          style={{
                            fontSize:
                              "5.5px",
                            color:
                              hexToRgba(
                                normalizeTextColor(
                                  card.textColor,
                                ),
                                0.62,
                              ),
                          }}
                        >
                          Official Student Identity
                        </p>
                      </div>

                      {/* DETAILS */}
                      <div
                        data-export-details-grid
                        className="grid shrink-0 grid-cols-4 gap-1.5"
                      >
                        {[
                          [
                            "Roll No.",
                            card.rollNumber ||
                              "—",
                          ],
                          [
                            "D.O.B",
                            card.dateOfBirth ||
                              "—",
                          ],
                          [
                            "Blood",
                            card.bloodGroup ||
                              "—",
                          ],
                          [
                            "Valid Till",
                            card.validTill ||
                              "—",
                          ],
                        ].map(
                          ([label, value]) => (
                            <div
                              key={label}
                              data-export-detail
                              className="flex min-w-0 flex-col items-center justify-center rounded-md border border-white/10 bg-black/10 px-1.5 py-1.5 text-center backdrop-blur-md"
                            >
                              <p
                                className="m-0 w-full text-center uppercase"
                                style={{
                                  fontSize:
                                    "5.5px",
                                  lineHeight:
                                    "1.1",
                                  color:
                                    hexToRgba(
                                      normalizeTextColor(
                                        card.textColor,
                                      ),
                                      0.62,
                                    ),
                                }}
                              >
                                {label}
                              </p>

                              <p
                                className="m-0 mt-0.5 w-full text-center font-black"
                                style={{
                                  fontSize:
                                    "7px",
                                  lineHeight:
                                    "1.1",
                                  color:
                                    normalizeTextColor(
                                      card.textColor,
                                    ),
                                }}
                              >
                                {value}
                              </p>
                            </div>
                          ),
                        )}
                      </div>

                      {/* BOTTOM */}
                      <div className="mt-1.5 flex items-end justify-between gap-3">
                        <div
                          className="min-w-0 text-left"
                          style={{
                            color:
                              hexToRgba(
                                normalizeTextColor(
                                  card.textColor,
                                ),
                                0.78,
                              ),
                            fontSize: "6px",
                          }}
                        >
                          <p className="font-black uppercase tracking-[0.16em]">
                            Department
                          </p>

                          <p className="mt-0.5 max-w-[220px] truncate">
                            {card.department ||
                              "Computer Science & Engineering"}
                          </p>
                        </div>

                        {card.rollNumber && (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white p-0.5 shadow-lg">
                            <QRCodeSVG
                              value={[
                                "COLLEGE ID CARD",
                                `Name: ${card.firstName} ${card.lastName}`.trim(),
                                `Roll No: ${card.rollNumber}`,
                                `DOB: ${card.dateOfBirth}`,
                                `Blood Group: ${card.bloodGroup}`,
                                `Phone: ${card.phone}`,
                                `Department: ${card.department}`,
                                `Address: ${card.address}`,
                                `College: ${card.collegeName}`,
                                `College Address: ${card.collegeAddress}`,
                                `College Phone: ${card.collegePhone}`,
                                `Valid Till: ${card.validTill}`,
                              ]
                                .filter(
                                  (
                                    line,
                                  ) =>
                                    line.trim() !==
                                    "",
                                )
                                .join(
                                  "\n",
                                )}
                              size={36}
                              bgColor="#ffffff"
                              fgColor="#000000"
                              level="M"
                              includeMargin={
                                false
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* SHINE */}
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.08)_35%,transparent_60%)]" />
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between px-1 text-[11px] font-medium text-slate-500">
                <span>
                  Hover the card for a 3D preview
                </span>

                <span className="hidden sm:inline">
                  Print-ready ratio
                </span>
              </div>

              {/* EXPORT */}
              <div className="mt-5">
                {exportError && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -5,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 backdrop-blur-xl"
                  >
                    {exportError}
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    type="button"
                    onClick={() =>
                      handleExport(
                        "png",
                      )
                    }
                    disabled={
                      exporting ||
                      saving ||
                      loadingCard
                    }
                    className="flex h-12 items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 text-sm font-black text-emerald-300 shadow-lg shadow-emerald-500/5 backdrop-blur-xl transition-all hover:border-emerald-400/30 hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                    whileHover={{
                      y: -1,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                  >
                    {exporting ? (
                      <Loader
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <Download size={17} />
                    )}

                    Export PNG
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() =>
                      handleExport(
                        "pdf",
                      )
                    }
                    disabled={
                      exporting ||
                      saving ||
                      loadingCard
                    }
                    className="flex h-12 items-center justify-center gap-2 rounded-xl border border-violet-400/20 bg-violet-500/10 px-4 text-sm font-black text-violet-300 shadow-lg shadow-violet-500/5 backdrop-blur-xl transition-all hover:border-violet-400/30 hover:bg-violet-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                    whileHover={{
                      y: -1,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                  >
                    {exporting ? (
                      <Loader
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <Download size={17} />
                    )}

                    Export PDF
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ==========================================
              FORM
          ========================================== */}

          <motion.section
            className="space-y-4 lg:col-span-3 lg:space-y-5"
            initial={{
              opacity: 0,
              x: 24,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            {/* FORM HEADER */}
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.045] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.18)] backdrop-blur-2xl sm:p-6">
              <div className="absolute -right-14 -top-14 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />

              <div className="relative flex items-center justify-between gap-4">
                <div>
                  <div className="mb-1 text-[11px] font-black uppercase tracking-[0.18em] text-blue-400">
                    Card Details
                  </div>

                  <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                    Build your ID card
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Fill in the details below and see the changes instantly.
                  </p>
                </div>

                <div className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/10 bg-blue-500/10 text-blue-400 sm:flex">
                  <Palette size={22} />
                </div>
              </div>
            </div>

            {/* PERSONAL */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.045] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.16)] backdrop-blur-2xl transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.055] sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/10 text-blue-400">
                  <User size={18} />
                </div>

                <div>
                  <h2 className="text-lg font-black text-white">
                    Personal Information
                  </h2>

                  <p className="mt-0.5 text-sm text-slate-400">
                    Enter the student's personal details.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>
                      First Name *
                    </label>

                    <input
                      type="text"
                      value={card.firstName}
                      onChange={(e) =>
                        updateCard(
                          "firstName",
                          e.target.value,
                        )
                      }
                      className={inputClass}
                      placeholder="Enter first name"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Last Name *
                    </label>

                    <input
                      type="text"
                      value={card.lastName}
                      onChange={(e) =>
                        updateCard(
                          "lastName",
                          e.target.value,
                        )
                      }
                      className={inputClass}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    Roll Number *
                  </label>

                  <input
                    type="text"
                    value={card.rollNumber}
                    onChange={(e) => {
                      const value =
                        e.target.value

                      setCard(
                        (previous) => ({
                          ...previous,
                          rollNumber:
                            value,
                          barcodeData:
                            value,
                        }),
                      )

                      setExportError(
                        null,
                      )

                      setSaveMessage(
                        null,
                      )
                    }}
                    className={inputClass}
                    placeholder="e.g. 21CS1001"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>
                      Date of Birth *
                    </label>

                    <input
                      type="text"
                      value={
                        card.dateOfBirth
                      }
                      onChange={(e) =>
                        updateCard(
                          "dateOfBirth",
                          e.target.value,
                        )
                      }
                      className={inputClass}
                      placeholder="DD/MM/YYYY"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Blood Group *
                    </label>

                    <select
                      value={
                        card.bloodGroup
                      }
                      onChange={(e) =>
                        updateCard(
                          "bloodGroup",
                          e.target.value,
                        )
                      }
                      className={inputClass}
                    >
                      <option value="O+">
                        O+
                      </option>

                      <option value="O-">
                        O-
                      </option>

                      <option value="A+">
                        A+
                      </option>

                      <option value="A-">
                        A-
                      </option>

                      <option value="B+">
                        B+
                      </option>

                      <option value="B-">
                        B-
                      </option>

                      <option value="AB+">
                        AB+
                      </option>

                      <option value="AB-">
                        AB-
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>
                      Department / Branch *
                    </label>

                    <input
                      type="text"
                      value={
                        card.department
                      }
                      onChange={(e) =>
                        updateCard(
                          "department",
                          e.target.value,
                        )
                      }
                      className={inputClass}
                      placeholder="Computer Science"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Phone *
                    </label>

                    <input
                      type="tel"
                      value={card.phone}
                      onChange={(e) =>
                        updateCard(
                          "phone",
                          e.target.value,
                        )
                      }
                      className={inputClass}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    Address *
                  </label>

                  <input
                    type="text"
                    value={card.address}
                    onChange={(e) =>
                      updateCard(
                        "address",
                        e.target.value,
                      )
                    }
                    className={inputClass}
                    placeholder="Enter address"
                  />
                </div>
              </div>
            </div>

            {/* COLLEGE */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.045] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.16)] backdrop-blur-2xl transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.055] sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-400/10 bg-indigo-500/10 text-indigo-400">
                  <GraduationCap size={18} />
                </div>

                <div>
                  <h2 className="text-lg font-black text-white">
                    College Information
                  </h2>

                  <p className="mt-0.5 text-sm text-slate-400">
                    Add your institution details.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>
                    College Name *
                  </label>

                  <input
                    type="text"
                    value={
                      card.collegeName
                    }
                    onChange={(e) =>
                      updateCard(
                        "collegeName",
                        e.target.value,
                      )
                    }
                    className={inputClass}
                    placeholder="Enter college name"
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    College Address *
                  </label>

                  <input
                    type="text"
                    value={
                      card.collegeAddress
                    }
                    onChange={(e) =>
                      updateCard(
                        "collegeAddress",
                        e.target.value,
                      )
                    }
                    className={inputClass}
                    placeholder="Enter college address"
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    College Telephone *
                  </label>

                  <input
                    type="tel"
                    value={
                      card.collegePhone
                    }
                    onChange={(e) =>
                      updateCard(
                        "collegePhone",
                        e.target.value,
                      )
                    }
                    className={inputClass}
                    placeholder="Enter college telephone"
                  />
                </div>
              </div>
            </div>

            {/* PHOTO */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.045] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.16)] backdrop-blur-2xl transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.055] sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-500/10 text-violet-400">
                  <ImageIcon size={18} />
                </div>

                <div>
                  <h2 className="text-lg font-black text-white">
                    Profile Photo
                  </h2>

                  <p className="mt-0.5 text-sm text-slate-400">
                    Upload a clear student photograph.
                  </p>
                </div>
              </div>

              <div
                className="group cursor-pointer rounded-2xl border-2 border-dashed border-white/10 bg-black/10 p-6 text-center transition-all hover:border-blue-400/30 hover:bg-blue-500/[0.04]"
                onClick={() =>
                  photoInputRef.current?.click()
                }
              >
                {card.photo ? (
                  <div>
                    <div className="mx-auto flex w-fit items-center justify-center rounded-2xl border border-white/10 bg-black/10 p-2 shadow-xl">
                      <img
                        src={
                          card.photo
                        }
                        alt="Preview"
                        className="h-36 w-28 rounded-xl object-cover"
                      />
                    </div>

                    <p className="mt-3 text-sm font-bold text-blue-400">
                      Click to change photo
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Current photo uploaded
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/10 bg-blue-500/10 text-blue-400 transition-transform group-hover:scale-105">
                      <Upload size={22} />
                    </div>

                    <p className="font-black text-white">
                      Upload Photo *
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      PNG, JPG or WEBP
                    </p>
                  </>
                )}
              </div>

              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={
                  handlePhotoUpload
                }
                className="hidden"
              />
            </div>

            {/* LOGO */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.045] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.16)] backdrop-blur-2xl transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.055] sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-500/10 text-emerald-400">
                  <GraduationCap
                    size={18}
                  />
                </div>

                <div>
                  <h2 className="text-lg font-black text-white">
                    College Logo
                  </h2>

                  <p className="mt-0.5 text-sm text-slate-400">
                    Upload your official college logo.
                  </p>
                </div>
              </div>

              <motion.button
                type="button"
                onClick={() =>
                  logoInputRef.current?.click()
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/10 bg-black/10 px-4 py-3.5 text-sm font-bold text-blue-400 transition-all hover:border-blue-400/30 hover:bg-blue-500/[0.04]"
                whileHover={{
                  y: -1,
                }}
                whileTap={{
                  scale: 0.99,
                }}
              >
                <Upload size={18} />

                {card.collegeLogo
                  ? "Change Logo"
                  : "Upload Logo"}
              </motion.button>

              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={
                  handleLogoUpload
                }
                className="hidden"
              />

              {card.collegeLogo && (
                <div className="mt-4 flex justify-center rounded-2xl border border-white/10 bg-black/10 p-6">
                  <img
                    src={
                      card.collegeLogo
                    }
                    alt="College Logo"
                    crossOrigin="anonymous"
                    className="h-24 w-24 object-contain"
                  />
                </div>
              )}
            </div>

            {/* CARD COLOR */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.045] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.16)] backdrop-blur-2xl transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.055] sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-pink-400/10 bg-pink-500/10 text-pink-400">
                  <Palette size={18} />
                </div>

                <div>
                  <h2 className="text-lg font-black text-white">
                    Card Color
                  </h2>

                  <p className="mt-0.5 text-sm leading-5 text-slate-400">
                    Choose the main color used across the ID card and exports.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Preview
                  </label>

                  <input
                    type="color"
                    value={normalizeHexColor(
                      card.cardColor,
                    )}
                    onChange={(e) =>
                      updateCard(
                        "cardColor",
                        e.target.value.toUpperCase(),
                      )
                    }
                    className="h-14 w-20 cursor-pointer rounded-xl border border-white/10 bg-white/[0.05] p-1"
                    aria-label="Choose card color"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <label
                    className={
                      labelClass
                    }
                  >
                    Hex color
                  </label>

                  <input
                    type="text"
                    value={
                      card.cardColor
                    }
                    onChange={(e) => {
                      const raw =
                        e.target.value.toUpperCase()

                      if (
                        /^#?[0-9A-F]{0,6}$/.test(
                          raw,
                        )
                      ) {
                        updateCard(
                          "cardColor",
                          raw.startsWith(
                            "#",
                          )
                            ? raw
                            : `#${raw}`,
                        )
                      }
                    }}
                    onBlur={() =>
                      updateCard(
                        "cardColor",
                        normalizeHexColor(
                          card.cardColor,
                        ),
                      )
                    }
                    className={
                      inputClass
                    }
                    placeholder="#2563EB"
                    maxLength={
                      7
                    }
                    aria-label="Card color hex value"
                  />
                </div>
              </div>

              <div className="mt-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Presets
                </p>

                <div className="flex flex-wrap gap-3">
                  {[
                    "#2563EB",
                    "#7C3AED",
                    "#059669",
                    "#DC2626",
                    "#0F172A",
                    "#EA580C",
                    "#DB2777",
                    "#0891B2",
                  ].map(
                    (color) => (
                      <button
                        key={
                          color
                        }
                        type="button"
                        onClick={() =>
                          updateCard(
                            "cardColor",
                            color,
                          )
                        }
                        className={`h-9 w-9 rounded-full border-2 transition-all ${
                          normalizeHexColor(
                            card.cardColor,
                          ) ===
                          color
                            ? "border-white ring-2 ring-blue-400/30 ring-offset-2 ring-offset-slate-900"
                            : "border-white/10 shadow"
                        }`}
                        style={{
                          backgroundColor:
                            color,
                        }}
                        aria-label={`Use ${color} card color`}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* TEXT COLOR */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.045] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.16)] backdrop-blur-2xl transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.055] sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-400/10 bg-amber-500/10 text-amber-400">
                  <Palette size={18} />
                </div>

                <div>
                  <h2 className="text-lg font-black text-white">
                    Text Color
                  </h2>

                  <p className="mt-0.5 text-sm leading-5 text-slate-400">
                    Choose the color for text printed on your card.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Preview
                  </label>

                  <input
                    type="color"
                    value={normalizeTextColor(
                      card.textColor,
                    )}
                    onChange={(e) =>
                      updateCard(
                        "textColor",
                        e.target.value.toUpperCase(),
                      )
                    }
                    className="h-14 w-20 cursor-pointer rounded-xl border border-white/10 bg-white/[0.05] p-1"
                    aria-label="Choose ID card text color"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <label
                    className={
                      labelClass
                    }
                  >
                    Hex color
                  </label>

                  <input
                    type="text"
                    value={
                      card.textColor
                    }
                    onChange={(e) => {
                      const raw =
                        e.target.value.toUpperCase()

                      if (
                        /^#?[0-9A-F]{0,6}$/.test(
                          raw,
                        )
                      ) {
                        updateCard(
                          "textColor",
                          raw.startsWith(
                            "#",
                          )
                            ? raw
                            : `#${raw}`,
                        )
                      }
                    }}
                    onBlur={() =>
                      updateCard(
                        "textColor",
                        normalizeTextColor(
                          card.textColor,
                        ),
                      )
                    }
                    className={
                      inputClass
                    }
                    placeholder="#FFFFFF"
                    maxLength={
                      7
                    }
                    aria-label="ID card text color hex value"
                  />
                </div>
              </div>

              <div className="mt-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Presets
                </p>

                <div className="flex flex-wrap gap-3">
                  {[
                    "#FFFFFF",
                    "#000000",
                    "#F8FAFC",
                    "#E2E8F0",
                    "#0F172A",
                    "#1E293B",
                  ].map(
                    (color) => (
                      <button
                        key={
                          color
                        }
                        type="button"
                        onClick={() =>
                          updateCard(
                            "textColor",
                            color,
                          )
                        }
                        className={`h-9 w-9 rounded-full border-2 transition-all ${
                          normalizeTextColor(
                            card.textColor,
                          ) ===
                          color
                            ? "border-white ring-2 ring-blue-400/30 ring-offset-2 ring-offset-slate-900"
                            : "border-white/10 shadow"
                        }`}
                        style={{
                          backgroundColor:
                            color,
                        }}
                        aria-label={`Use ${color} text color`}
                      />
                    ),
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const {
                    r,
                    g,
                    b,
                  } =
                    hexToRgb(
                      card.cardColor,
                    )

                  const luminance =
                    (0.299 * r +
                      0.587 * g +
                      0.114 * b) /
                    255

                  updateCard(
                    "textColor",
                    luminance >
                      0.62
                      ? "#0F172A"
                      : "#FFFFFF",
                  )
                }}
                className="mt-4 inline-flex items-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-slate-300 transition-all hover:bg-white/[0.07] hover:text-white"
              >
                Auto Contrast
              </button>
            </div>

            {/* VALIDITY */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.045] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.16)] backdrop-blur-2xl transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.055] sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-500/10 text-cyan-400">
                  <CalendarDays
                    size={18}
                  />
                </div>

                <div>
                  <h2 className="text-lg font-black text-white">
                    Card Validity
                  </h2>

                  <p className="mt-0.5 text-sm text-slate-400">
                    Set the expiration year.
                  </p>
                </div>
              </div>

              <label
                className={
                  labelClass
                }
              >
                Valid Till
              </label>

              <input
                type="text"
                value={
                  card.validTill
                }
                onChange={(e) =>
                  updateCard(
                    "validTill",
                    e.target.value,
                  )
                }
                className={
                  inputClass
                }
                placeholder="2027"
              />
            </div>

            {/* SAVE */}
            <div className="relative overflow-hidden rounded-2xl border border-blue-400/15 bg-linear-to-br from-blue-600/80 via-indigo-600/80 to-violet-600/80 p-5 shadow-[0_25px_60px_rgba(37,99,235,0.18)] backdrop-blur-xl sm:p-6">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

              <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-blue-300/10 blur-3xl" />

              <div className="relative">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-1 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-blue-100">
                      <CheckCircle2
                        size={12}
                      />

                      Ready to save
                    </div>

                    <h2 className="text-xl font-black text-white sm:text-2xl">
                      Finish your ID card
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-blue-100/80">
                      Save your card to your account and return to your dashboard.
                    </p>
                  </div>

                  <div className="hidden h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white sm:flex">
                    <Save size={20} />
                  </div>
                </div>

                {saveMessage && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -5,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-100 backdrop-blur-md"
                  >
                    <CheckCircle2
                      size={17}
                      className="text-emerald-300"
                    />

                    {saveMessage}
                  </motion.div>
                )}

                <motion.button
                  type="button"
                  onClick={
                    handleSaveCard
                  }
                  disabled={
                    saving ||
                    exporting ||
                    loadingCard
                  }
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.92] px-6 py-3.5 text-base font-black text-blue-700 shadow-xl transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 sm:py-4"
                  whileHover={{
                    scale:
                      saving ||
                      exporting
                        ? 1
                        : 1.01,
                  }}
                  whileTap={{
                    scale:
                      saving ||
                      exporting
                        ? 1
                        : 0.99,
                  }}
                >
                  {saving ? (
                    <>
                      <Loader
                        size={19}
                        className="animate-spin"
                      />

                      {cardId
                        ? "Updating..."
                        : "Saving..."}
                    </>
                  ) : (
                    <>
                      <Save
                        size={19}
                      />

                      {cardId
                        ? "Update ID Card"
                        : "Save ID Card"}
                    </>
                  )}
                </motion.button>

                <p className="mt-3 text-center text-xs font-medium text-blue-100/80">
                  {cardId
                    ? "Changes will update your saved ID card."
                    : "Your ID card will be saved to your account."}
                </p>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  )
}

export default Page;