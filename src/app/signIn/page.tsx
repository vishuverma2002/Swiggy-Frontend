"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return null;
}

"use client";

import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Context } from "@/store/store";
import Toast from "@/components/toast/Toast";

const FOOD_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    alt: "Burger",
  },
  {
    src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
    alt: "Pizza",
  },
  {
    src: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80",
    alt: "Pasta",
  },
  {
    src: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80",
    alt: "Dessert",
  },
];

export default function SignInPage() {
  const { login } = useContext(Context);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
      )}
      {/* Left Section - Food Images */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative lg:w-1/2 min-h-[280px] lg:min-h-screen overflow-hidden"
      >
        <div className="absolute inset-0 flex">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={FOOD_IMAGES[currentImageIndex].src}
                alt={FOOD_IMAGES[currentImageIndex].alt}
                fill
                className="object-cover animate-[zoom-slow_8s_ease-in-out_infinite]"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-foodie-orange/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 flex gap-2 justify-center">
          {FOOD_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImageIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentImageIndex
                  ? "w-8 bg-white"
                  : "w-1.5 bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`View ${FOOD_IMAGES[i].alt}`}
            />
          ))}
        </div>
      </motion.div>

      {/* Right Section - Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="flex-1 flex items-center justify-center p-6 lg:p-12 relative"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-foodie-orange/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-foodie-red/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-200/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.01 }}
          className="relative w-full max-w-md"
        >
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-orange-200/30 border border-white/50 p-8 lg:p-10">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-foodie-orange to-foodie-red flex items-center justify-center shadow-lg shadow-orange-300/50">
                  <span className="text-2xl">🍔</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-foodie-orange to-foodie-red bg-clip-text text-transparent">
                  FoodieHub
                </h1>
              </div>
              <p className="text-gray-600 text-sm">Welcome back! Sign in to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
              {/* Email - Floating Label */}
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="peer w-full px-4 pt-5 pb-2 border-2 border-gray-200 rounded-xl focus:border-foodie-orange focus:ring-4 focus:ring-orange-100 outline-none transition-all duration-200 bg-white/50"
                  placeholder=" "
                  required
                  autoComplete="off"
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 pointer-events-none peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-foodie-orange peer-focus:text-sm peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-sm"
                >
                  Email address
                </label>
              </div>

              {/* Password - Floating Label */}
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer w-full px-4 pt-5 pb-2 border-2 border-gray-200 rounded-xl focus:border-foodie-orange focus:ring-4 focus:ring-orange-100 outline-none transition-all duration-200 bg-white/50"
                  placeholder=" "
                  required
                  autoComplete="new-password"
                />
                <label
                  htmlFor="password"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 pointer-events-none peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-foodie-orange peer-focus:text-sm peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-sm"
                >
                  Password
                </label>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-foodie-orange focus:ring-foodie-orange"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-800">
                    Remember me
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-foodie-orange hover:text-foodie-orange-dark transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-foodie-orange to-foodie-red shadow-lg shadow-orange-300/40 hover:shadow-xl hover:shadow-orange-400/50 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Login"
                )}
              </motion.button>
            </form>

            {/* Sign up link */}
            <p className="mt-6 text-center text-sm text-gray-600">
              New to FoodieHub?{" "}
              <Link
                href="/signUp"
                className="font-semibold text-foodie-orange hover:text-foodie-orange-dark transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
