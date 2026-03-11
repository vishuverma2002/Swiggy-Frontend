import {
  FaLinkedin,
  FaFacebookF,
  FaPinterest,
  FaTwitter,
} from "react-icons/fa";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";

export const defaultFooterData = {
  cta: {
    title: "For better experience, download the",
    appName: "FoodieHub",
    suffix: "app now",
  },
  sections: [
    {
      id: "company",
      title: "Company",
      links: [
        { label: "About Us", href: "/" },
        { label: "FoodieHub Corporate", href: "/" },
        { label: "Careers", href: "/" },
        { label: "Teams", href: "/" },
        { label: "FoodieHub One", href: "/" },
        { label: "FoodieHub Instamart", href: "/" },
        { label: "FoodieHub Dineout", href: "/" },
        { label: "FoodieHub Genie", href: "/" },
      ],
    },
    {
      id: "contact",
      title: "Contact Us",
      links: [
        { label: "Help & Support", href: "/" },
        { label: "Partner With Us", href: "/" },
        { label: "Ride With Us", href: "/" },
      ],
    },
    {
      id: "legal",
      title: "Legal",
      links: [
        { label: "Terms & Condition", href: "/" },
        { label: "Cookie Policy", href: "/" },
        { label: "Privacy Policy", href: "/" },
        { label: "Investor Relation", href: "/" },
      ],
    },
    {
      id: "available",
      title: "Available in:",
      links: [
        { label: "Bangalore", href: "/" },
        { label: "Gurgaon", href: "/" },
        { label: "Hyderabad", href: "/" },
        { label: "Delhi", href: "/" },
        { label: "Mumbai", href: "/" },
        { label: "Pune", href: "/" },
      ],
      isHighlighted: true,
    },
    {
      id: "life",
      title: "Life at FoodieHub",
      links: [
        { label: "Explore with FoodieHub", href: "/" },
        { label: "FoodieHub News", href: "/" },
        { label: "Snackables", href: "/" },
      ],
    },
    {
      id: "social",
      title: "Social Links",
      isSocial: true,
      socialLinks: [
        { icon: FaLinkedin, url: "https://in.linkedin.com/?original_referer=https%3A%2F%2Fwww.bing.com%2F" },
        { icon: FaInstagram, url: "https://www.instagram.com/accounts/login/?hl=en" },
        { icon: FaFacebookF, url: "https://www.facebook.com/" },
        { icon: FaPinterest, url: "https://in.pinterest.com/" },
        { icon: FaXTwitter, url: "https://x.com/?lang=en" },
      ],
    },
  ],
  copyright: "© 2025 FoodieHub. All rights reserved.",
  developer: "Developed by Vishu Verma",
};
