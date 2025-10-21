"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Shield,
  Zap,
  Database,
  Code2,
  Lock,
  ArrowRight,
  FileImage,
  FileVideo,
  FileText,
  CheckCircle,
  Star,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Navigation */}
      <nav className="border-b border-neutral-800 bg-[#0A0A0F]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-black" />
              </div>
              <span className="text-lg font-semibold">Kairoo Storage</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/docs"
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Documentation
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-neutral-700 hover:bg-neutral-400 hover:border-neutral-600 text-black"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6 bg-yellow-500/10 text-yellow-500 border-yellow-500/20 px-4 py-1.5 text-sm font-medium hover:bg-yellow-500/20">
              <Star className="w-3.5 h-3.5 mr-1.5 fill-yellow-500" />
              Trusted by 10,000+ Developers
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            Store Files at{" "}
            <span className="text-yellow-500">Lightning Speed</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto"
          >
            Enterprise-grade file storage with powerful APIs. Upload images,
            videos, and documents with blazing-fast performance and rock-solid
            security.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a href="mailto:boussettah.dev@gmail.com">
              <Button
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-6 text-base"
              >
                Request Access
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-neutral-700 hover:bg-neutral-400 px-8 py-6 hover:border-neutral-600 text-black"
              >
                View Dashboard
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto"
          >
            {[
              { value: "99.9%", label: "Uptime" },
              { value: "<100ms", label: "Response Time" },
              { value: "Unlimited", label: "Storage" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-colors"
              >
                <div className="text-4xl font-bold text-yellow-500 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-500 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20 lg:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-neutral-400">
              Built for developers, designed for scale
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Upload,
                title: "Multi-Format Support",
                description:
                  "Upload images, videos, and documents seamlessly with automatic type detection",
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description:
                  "API key authentication with project isolation and encrypted data transfer",
              },
              {
                icon: Zap,
                title: "Blazing Fast",
                description:
                  "Optimized delivery with CDN integration and edge caching",
              },
              {
                icon: Code2,
                title: "Developer First",
                description:
                  "RESTful API with comprehensive documentation and code examples",
              },
              {
                icon: Lock,
                title: "Private & Secure",
                description:
                  "Your data is encrypted at rest and in transit with SOC 2 compliance",
              },
              {
                icon: Database,
                title: "Reliable Storage",
                description:
                  "Built on enterprise-grade infrastructure with 99.9% uptime SLA",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 hover:border-neutral-700 transition-all group"
              >
                <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-500/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* File Types Section */}
      <section className="container mx-auto px-6 py-20 lg:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Support for All File Types
            </h2>
            <p className="text-lg text-neutral-400">
              One API for all your storage needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: FileImage,
                title: "Images",
                formats: "JPG, PNG, GIF, WebP, SVG",
              },
              {
                icon: FileVideo,
                title: "Videos",
                formats: "MP4, WebM, MOV, AVI",
              },
              {
                icon: FileText,
                title: "Documents",
                formats: "PDF, DOC, TXT, MD",
              },
            ].map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-10 text-center hover:border-neutral-700 transition-all"
              >
                <type.icon className="w-14 h-14 mx-auto mb-6 text-yellow-500" />
                <h3 className="text-2xl font-semibold mb-3">{type.title}</h3>
                <p className="text-neutral-400">{type.formats}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto">
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-12 lg:p-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-neutral-400 mb-10 max-w-2xl mx-auto">
              Contact us to request API access and start building today
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a href="mailto:boussettah.dev@gmail.com">
                <Button
                  size="lg"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-10 py-6 text-base"
                >
                  Contact Admin
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <span className="text-neutral-400">boussettah.dev@gmail.com</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Database className="w-4 h-4 text-black" />
              </div>
              <span className="text-sm text-neutral-500">
                © 2025 Kairoo Storage. All rights reserved.
              </span>
            </div>
            <div className="flex gap-6 text-sm text-neutral-500">
              <Link
                href="/dashboard/docs"
                className="hover:text-white transition-colors"
              >
                Documentation
              </Link>
              <a
                href="mailto:boussettah.dev@gmail.com"
                className="hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
