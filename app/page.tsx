"use client"

import { useEffect, useContext } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, Variants } from "framer-motion"
import {
  ArrowRight,
  Share2,
  Download,
  Palette,
  Smartphone,
  ShieldCheck,
  Printer,
} from "lucide-react"
import { AuthContext } from "@/lib/auth-context"

export default function Home() {
  const router = useRouter()

  const authContext = useContext(AuthContext)

  const user = authContext?.user
  const loading = authContext?.loading ?? true

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard")
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
      </main>
    )
  }

  if (user) {
    return null
  }

  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const features = [
    {
      icon: Palette,
      title: "Easy Customization",
      desc: "Personalize student ID cards with your college details, colors, photo, logo, and validity.",
    },
    {
      icon: Download,
      title: "PNG & PDF Export",
      desc: "Download high-quality digital cards in PNG or print-ready PDF format whenever you need them.",
    },
    {
      icon: Share2,
      title: "Save & Manage Cards",
      desc: "Save your ID cards securely and access, edit, or export them from your dashboard anytime.",
    },
  ]

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      {/* ==================== NAVBAR ==================== */}

      <motion.nav
        className="fixed left-0 top-0 z-50 w-full border-b border-slate-700/30 bg-slate-950/80 backdrop-blur-md"
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 lg:px-8">
          {/* Logo */}

          <Link href="/" className="shrink-0">
            <motion.div
              className="flex items-center gap-2 sm:gap-3"
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.98,
              }}
            >
              <img
                src="public/icon.svg"
                alt="CardForge"
                className="h-8 w-8 object-contain sm:h-9 sm:w-9"
              />

              <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
                CardForge
              </span>
            </motion.div>
          </Link>

          {/* Navigation Buttons */}

          <div className="flex items-center gap-1.5 sm:gap-3">
            <motion.div
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
            >
              <Link
                href="/sign-in"
                className="inline-block rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:text-white sm:px-5 sm:text-base"
              >
                Sign In
              </Link>
            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
            >
              <Link
                href="/sign-up"
                className="inline-block whitespace-nowrap rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium transition-colors hover:bg-blue-700 sm:px-6 sm:py-2.5 sm:text-base"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* ==================== HERO ==================== */}

      <motion.section
        className="relative mx-auto max-w-7xl px-4 pb-14 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8 lg:pt-36"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Animated Background */}

        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-56 w-56 animate-pulse rounded-full bg-blue-500/20 blur-3xl sm:-left-32 sm:-top-32 sm:h-72 sm:w-72 lg:-left-40 lg:-top-40 lg:h-96 lg:w-96" />

          <div className="absolute right-[-6rem] top-1/2 h-56 w-56 -translate-y-1/2 animate-pulse rounded-full bg-cyan-500/20 blur-3xl sm:right-[-4rem] sm:h-72 sm:w-72 lg:right-0 lg:h-96 lg:w-96" />

          <div className="absolute left-1/2 top-[35%] h-40 w-40 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl sm:h-64 sm:w-64" />
        </div>

        {/* Hero Content */}

        <motion.div
          variants={itemVariants}
          className="mb-10 text-center sm:mb-14"
        >
          {/* Small Product Badge */}

          <motion.div
            variants={itemVariants}
            className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-blue-300 sm:mb-6 sm:px-4 sm:py-2 sm:text-sm"
          >
            <Smartphone size={14} />
            Student ID Card Builder
          </motion.div>

          <motion.h1
            className="
              mx-auto
              mb-5
              max-w-5xl
              text-4xl
              font-bold
              leading-[1.08]
              tracking-tight
              min-[400px]:text-5xl
              sm:mb-6
              sm:text-6xl
              lg:text-7xl
              xl:text-8xl
            "
            variants={itemVariants}
          >
            Create Professional{" "}
            <span className="bg-linear-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Student ID Cards
            </span>{" "}
            in Minutes
          </motion.h1>

          <motion.p
            className="
              mx-auto
              mb-7
              max-w-2xl
              px-1
              text-base
              leading-relaxed
              text-slate-300
              sm:mb-8
              sm:text-lg
              lg:text-xl
            "
            variants={itemVariants}
          >
            Design, customize, save, and export professional student ID cards
            with an intuitive card builder built for colleges and educational
            institutions.
          </motion.p>

          {/* Hero Buttons */}

          <motion.div
            className="
              mx-auto
              flex
              w-full
              max-w-md
              flex-col
              justify-center
              gap-3
              sm:max-w-none
              sm:flex-row
              sm:gap-4
            "
            variants={itemVariants}
          >
            <motion.div
              className="w-full sm:w-auto"
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
            >
              <Link
                href="/sign-up"
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-blue-600
                  px-6
                  py-3.5
                  font-semibold
                  transition-colors
                  hover:bg-blue-700
                  sm:w-auto
                  sm:px-8
                  sm:py-4
                "
              >
                Create Your ID Card
                <ArrowRight size={20} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust line */}

          <motion.div
            variants={itemVariants}
            className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500 sm:text-sm"
          >
            <ShieldCheck size={15} className="text-emerald-400" />

            <span>Simple • Professional • Print-ready</span>
          </motion.div>
        </motion.div>

        {/* ==================== ID CARD PREVIEW ==================== */}

        <motion.div
          variants={itemVariants}
          className="mx-auto mt-10 max-w-4xl sm:mt-14"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-3 shadow-[0_30px_100px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.13),transparent_35%)]" />

            <div className="relative mx-auto max-w-3xl">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <Smartphone size={14} />
                  Digital Student ID
                </div>

                <div className="hidden items-center gap-1.5 text-xs text-slate-500 sm:flex">
                  <Printer size={13} />
                  Print-ready
                </div>
              </div>

              <div className="relative aspect-[85.6/53.98] overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-blue-600 via-blue-700 to-indigo-900 shadow-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.18),transparent_25%),radial-gradient(circle_at_10%_90%,rgba(255,255,255,0.10),transparent_30%)]" />

                <div className="relative flex h-full flex-col p-[5%]">
                  {/* Card Header */}

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/50 bg-white p-1 shadow-lg sm:h-10 sm:w-10">
                        <div className="h-full w-full rounded-full bg-blue-600" />
                      </div>

                      <div>
                        <div className="text-[7px] font-black uppercase tracking-wide text-white sm:text-[10px]">
                          Your College Name
                        </div>

                        <div className="mt-0.5 text-[5px] text-white/70 sm:text-[7px]">
                          College Address
                        </div>

                        <div className="text-[5px] text-white/70 sm:text-[7px]">
                          College Contact
                        </div>
                      </div>
                    </div>

                    <div className="h-12 w-9 rounded-md border border-white/70 bg-white/15 sm:h-16 sm:w-12" />
                  </div>

                  {/* Card Identity */}

                  <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <div className="mb-1 rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[5px] font-black uppercase tracking-widest text-white sm:text-[7px]">
                      Student ID Card
                    </div>

                    <div className="text-[12px] font-black uppercase text-white sm:text-[18px]">
                      Student Name
                    </div>

                    <div className="mt-0.5 text-[6px] font-semibold text-white/80 sm:text-[9px]">
                      Computer Science & Engineering
                    </div>

                    <div className="mt-1 text-[5px] uppercase tracking-widest text-white/60 sm:text-[7px]">
                      Official Student Identity
                    </div>
                  </div>

                  {/* Details */}

                  <div className="grid grid-cols-4 gap-1 sm:gap-2">
                    {[
                      ["Roll No.", "21CS1001"],
                      ["D.O.B", "12/08/2003"],
                      ["Blood", "O+"],
                      ["Valid Till", "2027"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex flex-col items-center justify-center rounded-md border border-white/10 bg-black/10 px-1 py-1.5 text-center"
                      >
                        <div className="text-[4.5px] uppercase text-white/60 sm:text-[6px]">
                          {label}
                        </div>

                        <div className="mt-0.5 text-[6px] font-black text-white sm:text-[8px]">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ==================== FEATURES ==================== */}

        <motion.div
          className="
            mt-14
            grid
            grid-cols-1
            gap-4
            sm:mt-20
            sm:gap-6
            md:grid-cols-2
            lg:grid-cols-3
            lg:gap-8
          "
          variants={containerVariants}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <motion.div
                key={index}
                className="
                    rounded-xl
                    border
                    border-slate-700/50
                    bg-slate-800/50
                    p-5
                    backdrop-blur
                    transition-all
                    hover:border-blue-500/50
                    hover:bg-slate-800/80
                    sm:p-6
                    lg:p-7
                  "
                variants={itemVariants}
                whileHover={{
                  y: -5,
                }}
              >
                <Icon className="mb-4 h-10 w-10 text-blue-400 sm:h-12 sm:w-12" />

                <h3 className="mb-2 text-lg font-semibold sm:text-xl">
                  {feature.title}
                </h3>

                <p className="text-sm leading-relaxed text-slate-400 sm:text-base">
                  {feature.desc}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.section>

      {/* ==================== CTA ==================== */}

      <motion.section
        className="
          relative
          mx-auto
          max-w-7xl
          px-4
          py-14
          text-center
          sm:px-6
          sm:py-20
          lg:px-8
        "
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
        }}
      >
        <motion.div
          className="
            rounded-2xl
            border
            border-slate-700/50
            bg-linear-to-r
            from-slate-800/50
            to-slate-900/50
            p-6
            backdrop-blur
            sm:p-10
            lg:p-12
          "
          whileHover={{
            borderColor: "rgb(59, 130, 246)",
          }}
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
            <Smartphone size={22} />
          </div>

          <h2
            className="
              mb-4
              text-2xl
              font-bold
              leading-tight
              min-[400px]:text-3xl
              sm:text-4xl
              lg:text-5xl
            "
          >
            Create your student ID card today
          </h2>

          <p
            className="
              mx-auto
              mb-7
              max-w-xl
              text-sm
              leading-relaxed
              text-slate-300
              sm:mb-8
              sm:text-base
              lg:text-lg
            "
          >
            Build a professional ID card, customize every important detail, and
            download it whenever you need a digital or physical copy.
          </p>

          <motion.div
            className="inline-block w-full sm:w-auto"
            whileHover={{
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.97,
            }}
          >
            <Link
              href="/sign-up"
              className="
                inline-flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-blue-600
                px-6
                py-3.5
                font-semibold
                hover:bg-blue-700
                sm:w-auto
                sm:px-8
                sm:py-4
              "
            >
              Start Creating
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ==================== FOOTER ==================== */}

      <motion.footer
        className="
          border-t
          border-slate-700/30
          px-4
          py-6
          text-center
          text-slate-400
          sm:px-6
          sm:py-8
          lg:px-8
        "
        initial={{
          opacity: 0,
        }}
        whileInView={{
          opacity: 1,
        }}
        viewport={{
          once: true,
        }}
      >
        <p className="text-xs sm:text-sm">
          © {new Date().getFullYear()} CardForge · Designed & developed by
          Saurav Bhandari
        </p>
      </motion.footer>
    </main>
  )
}
