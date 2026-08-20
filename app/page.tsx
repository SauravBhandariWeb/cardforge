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
      <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="w-10 h-10 rounded-full border-4 border-slate-700 border-t-blue-500 animate-spin" />
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
      desc: "Drag-and-drop editor with 100+ professional templates.",
    },
    {
      icon: Download,
      title: "Multiple Exports",
      desc: "Export your ID cards as PDF or PNG in high resolution.",
    },
    {
      icon: Share2,
      title: "Share & Collaborate",
      desc: "Share your designs with your team instantly.",
    },
  ]

  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* ==================== NAVBAR ==================== */}
      <motion.nav
        className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-700/30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <motion.div
              className="flex items-center gap-2 sm:gap-3"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <img
                src="public/icon.svg"
                alt="CardForge"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
              />

              <span className="text-xl sm:text-2xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                CardForge
              </span>
            </motion.div>
          </Link>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href="/sign-in"
                className="px-3 sm:px-5 py-2 text-sm sm:text-base rounded-lg text-slate-300 hover:text-white transition-colors inline-block"
              >
                Sign In
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href="/sign-up"
                className="px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base inline-block whitespace-nowrap"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* ==================== HERO ==================== */}
      <motion.section
        className="relative pt-28 sm:pt-32 lg:pt-36 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-blue-500/20 rounded-full blur-3xl -top-20 sm:-top-32 lg:-top-40 -left-20 sm:-left-32 lg:-left-40 animate-pulse" />

          <div className="absolute w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-cyan-500/20 rounded-full blur-3xl top-1/2 -translate-y-1/2 right-[-6rem] sm:right-[-4rem] lg:right-0 animate-pulse" />
        </div>

        {/* Hero Content */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-10 sm:mb-14"
        >
          <motion.h1
            className="
              text-4xl
              min-[400px]:text-5xl
              sm:text-6xl
              lg:text-7xl
              xl:text-8xl
              font-bold
              mb-5
              sm:mb-6
              leading-[1.08]
              tracking-tight
              max-w-5xl
              mx-auto
            "
            variants={itemVariants}
          >
            Create Professional{" "}
            <span className="bg-linear-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              ID Cards
            </span>{" "}
            in Minutes
          </motion.h1>

          <motion.p
            className="
              text-base
              sm:text-lg
              lg:text-xl
              text-slate-300
              mb-7
              sm:mb-8
              max-w-2xl
              mx-auto
              leading-relaxed
              px-1
            "
            variants={itemVariants}
          >
            Design, customize, and export stunning digital and physical ID
            cards with our intuitive card builder. Perfect for businesses,
            events, and organizations.
          </motion.p>

          {/* Hero Buttons */}
          <motion.div
            className="
              flex
              flex-col
              sm:flex-row
              gap-3
              sm:gap-4
              justify-center
              w-full
              max-w-md
              sm:max-w-none
              mx-auto
            "
            variants={itemVariants}
          >
            <motion.div
              className="w-full sm:w-auto"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href="/sign-up"
                className="
                  w-full
                  sm:w-auto
                  px-6
                  sm:px-8
                  py-3.5
                  sm:py-4
                  bg-blue-600
                  hover:bg-blue-700
                  rounded-lg
                  font-semibold
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition-colors
                "
              >
                Start Creating
                <ArrowRight size={20} />
              </Link>
            </motion.div>

            <motion.button
              type="button"
              className="
                w-full
                sm:w-auto
                px-6
                sm:px-8
                py-3.5
                sm:py-4
                border
                border-slate-600
                hover:border-slate-400
                rounded-lg
                font-semibold
                transition-colors
              "
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Watch Demo
            </motion.button>
          </motion.div>
        </motion.div>

        {/* ==================== FEATURES ==================== */}
        <motion.div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-4
            sm:gap-6
            lg:gap-8
            mt-14
            sm:mt-20
          "
          variants={containerVariants}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <motion.div
                key={index}
                className="
                  p-5
                  sm:p-6
                  lg:p-7
                  rounded-xl
                  border
                  border-slate-700/50
                  bg-slate-800/50
                  hover:bg-slate-800/80
                  backdrop-blur
                  transition-all
                  hover:border-blue-500/50
                "
                variants={itemVariants}
                whileHover={{
                  y: -5,
                }}
              >
                <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 mb-4" />

                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  {feature.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
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
          py-14
          sm:py-20
          px-4
          sm:px-6
          lg:px-8
          max-w-7xl
          mx-auto
          text-center
        "
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div
          className="
            p-6
            sm:p-10
            lg:p-12
            rounded-2xl
            border
            border-slate-700/50
            bg-linear-to-r
            from-slate-800/50
            to-slate-900/50
            backdrop-blur
          "
          whileHover={{
            borderColor: "rgb(59, 130, 246)",
          }}
        >
          <h2
            className="
              text-2xl
              min-[400px]:text-3xl
              sm:text-4xl
              lg:text-5xl
              font-bold
              mb-4
              leading-tight
            "
          >
            Ready to create your first ID card?
          </h2>

          <p
            className="
              text-sm
              sm:text-base
              lg:text-lg
              text-slate-300
              mb-7
              sm:mb-8
              max-w-xl
              mx-auto
              leading-relaxed
            "
          >
            Join thousands of businesses creating professional ID cards with
            CardForge.
          </p>

          <motion.div
            className="inline-block w-full sm:w-auto"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              href="/sign-up"
              className="
                w-full
                sm:w-auto
                px-6
                sm:px-8
                py-3.5
                sm:py-4
                bg-blue-600
                hover:bg-blue-700
                rounded-lg
                font-semibold
                inline-flex
                items-center
                justify-center
                gap-2
              "
            >
              Get Started Free
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
          py-6
          sm:py-8
          px-4
          sm:px-6
          lg:px-8
          text-center
          text-slate-400
        "
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <p className="text-xs sm:text-sm">
          &copy; {new Date().getFullYear()} CardForge. All rights reserved.
        </p>
      </motion.footer>
    </main>
  )
}