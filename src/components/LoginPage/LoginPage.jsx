"use client";

import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import styles from "./LoginPage.module.css";
import { Context } from "@/store/store";
import Toast from "@/components/toast/Toast";
import Modal from "@/components/modal/Modal";

export default function LoginPage({ defaultMode = "login" }) {
  const { login } = useContext(Context);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const showSignUpSuccess = searchParams.get("signup") === "success";
  const [isSignUp, setIsSignUp] = useState(defaultMode === "signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [toast, setToast] = useState(null);

  // Forgot password modal state
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState("email"); // "email" | "otp"
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");

  useEffect(() => {
    setIsSignUp(pathname === "/signUp");
  }, [pathname]);

  useEffect(() => {
    if (showSignUpSuccess && !isSignUp) {
      setToast({
        message: "Account successfully created",
        title: "Success",
        success: true,
      });

      // Remove signup query so toast doesn't re-trigger on reload
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("signup");
        window.history.replaceState(null, "", url.toString());
      }
    }
  }, [showSignUpSuccess, isSignUp]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login({ email }, rememberMe);
      setIsLoading(false);
      router.push("/?login=success");
    }, 1500);
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/login?signup=success");
    }, 1500);
  };

  const handleSubmit = isSignUp ? handleSignUpSubmit : handleLoginSubmit;

  const openForgotModal = () => {
    setForgotStep("email");
    setForgotEmail(email || "");
    setOtp("");
    setForgotError("");
    setIsForgotOpen(true);
  };

  const closeForgotModal = () => {
    setIsForgotOpen(false);
    setForgotLoading(false);
    setForgotError("");
    setOtp("");
  };

  const handleForgotEmailSubmit = (e) => {
    e.preventDefault();
    setForgotError("");
    if (!forgotEmail.trim()) {
      setForgotError("Please enter your email.");
      return;
    }
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotStep("otp");
    }, 800);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setForgotError("");
    if (otp.trim().length !== 6) {
      setForgotError("Please enter the 6 digit OTP.");
      return;
    }
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setIsForgotOpen(false);
      setToast({
        message: "OTP verified successfully. You can now reset your password.",
        title: "Password reset",
        success: true,
      });
    }, 900);
  };

  return (
    <div className={styles.container}>
      {toast && (
        <div style={{ position: "fixed", right: 20, top: 20, zIndex: 5000 }}>
          <Toast
            message={toast.message}
            title={toast.title}
            success={toast.success}
            unloader={() => setToast(null)}
          />
        </div>
      )}

      {/* Fullscreen background image */}
      <div className={styles.backdrop} />

      {/* Main content over image */}
      <div className={styles.content}>
        {/* Hero copy */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <p className={styles.heroTag}>WELCOME TO FOODIEHUB</p>

            <h2 className={styles.heroTitle}>
              Crave it.{" "}
              <span className={styles.heroHighlight}>Tap it.</span> Taste it.
            </h2>

            <p className={styles.heroSubtitle}>
              Discover the best pizzas, burgers, desserts and street food around
              you. Fast delivery, fresh flavors, and food you&apos;ll love at
              every bite.
            </p>

            <div className={styles.heroBadges}>
              <span className={styles.heroPill}>⚡ 30-min average delivery</span>
              <span className={styles.heroPill}>📍 Live order tracking</span>
              <span className={styles.heroPill}>
                ⭐ Loved by foodies near you
              </span>
            </div>
          </div>
        </section>

        {/* Login / Sign-up form overlay */}
        <section className={styles.formSection}>
          <div className={styles.formWrapper}>
            <div className={styles.formCard}>
              <div className={styles.logoSection}>
                <div className={styles.logoIcon}>🍔</div>
                <h1 className={styles.title}>FoodieHub</h1>
                <p className={styles.subtitle}>
                  {isSignUp
                    ? "Create your account to get started"
                    : "Welcome back! Sign in to continue"}
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className={styles.form}
                autoComplete="off"
              >
                {isSignUp && (
                  <div className={styles.inputGroup}>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={styles.input}
                      placeholder="Full name"
                      required
                      autoComplete="off"
                    />
                  </div>
                )}

                <div className={styles.inputGroup}>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    placeholder="Email address"
                    required
                    autoComplete="off"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                    placeholder="Password"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg
                        className={styles.toggleIcon}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className={styles.toggleIcon}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {isSignUp && (
                  <div className={styles.inputGroup}>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setPasswordError("");
                      }}
                      className={styles.input}
                      placeholder="Confirm password"
                      required
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <svg
                          className={styles.toggleIcon}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className={styles.toggleIcon}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                )}

                {passwordError && (
                  <p className={styles.errorText}>{passwordError}</p>
                )}

                <div className={styles.optionsRow}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className={styles.checkbox}
                    />
                    <span className={styles.checkboxText}>Remember Me</span>
                  </label>
                  {!isSignUp && (
                  <button
                    type="button"
                    className={styles.forgotLinkButton}
                    onClick={openForgotModal}
                  >
                    Forgot Password?
                  </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={styles.submitButton}
                >
                  {isLoading ? (
                    <span className={styles.loadingState}>
                      <span className={styles.spinner} />
                      {isSignUp ? "Creating account..." : "Signing in..."}
                    </span>
                  ) : (
                    (isSignUp ? "Sign Up" : "Login")
                  )}
                </button>
              </form>

              <p className={styles.signUpText}>
                {isSignUp ? (
                  <>
                    Already have an account?{" "}
                    <Link href="/login" className={styles.signUpLink}>
                      Login
                    </Link>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{" "}
                    <Link href="/signUp" className={styles.signUpLink}>
                      Sign Up
                    </Link>
                  </>
                )}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Forgot password modal */}
      <Modal
        visible={isForgotOpen}
        onClose={closeForgotModal}
        title={forgotStep === "email" ? "Forgot password" : "Enter OTP"}
        maxWidth="420px"
        fullScreenOverlay
      >
        <form
          onSubmit={
            forgotStep === "email" ? handleForgotEmailSubmit : handleOtpSubmit
          }
          className={styles.form}
          autoComplete="off"
        >
          {forgotStep === "email" ? (
            <>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#6b7280",
                  marginBottom: "0.75rem",
                }}
              >
                Enter the email linked with your account. We&apos;ll send a 6
                digit OTP to verify it.
              </p>
              <div className={styles.inputGroup}>
                <input
                  id="forgotEmail"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className={styles.input}
                  placeholder="Email address"
                  required
                  autoComplete="off"
                />
              </div>
            </>
          ) : (
            <>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#6b7280",
                  marginBottom: "0.75rem",
                }}
              >
                Enter the 6 digit OTP we&apos;ve sent to{" "}
                <span style={{ fontWeight: 600 }}>{forgotEmail}</span>.
              </p>
              <div className={styles.inputGroup}>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className={styles.input}
                  placeholder="Enter 6 digit OTP"
                  required
                  autoComplete="one-time-code"
                />
              </div>
            </>
          )}

          {forgotError && (
            <p className={styles.errorText} style={{ marginTop: "-4px" }}>
              {forgotError}
            </p>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={forgotLoading}
            style={{ marginTop: "16px" }}
          >
            {forgotLoading ? (
              <span className={styles.loadingState}>
                <span className={styles.spinner} />
                {forgotStep === "email" ? "Sending OTP..." : "Verifying..."}
              </span>
            ) : forgotStep === "email" ? (
              "Send OTP"
            ) : (
              "Submit OTP"
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
}
