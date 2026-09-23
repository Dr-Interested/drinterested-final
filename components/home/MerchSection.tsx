"use client"

import Image from "next/image"
import Link from "next/link"
import { ExternalLink, ShoppingBag, ShoppingCart, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { fadeIn } from "./animations"

export default function MerchSection() {
  return (
    <>
      {/* Merch Store Section */}
      <section className="py-10 bg-[#f5f1eb]/30">
        <div className="container">
          <motion.div
            className="text-center mb-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-2xl font-bold text-[#405862] inline-flex flex-col items-center">
              Merch Store
              <div className="w-16 h-1 bg-[#4ecdc4] mt-2"></div>
            </h2>
            <p className="text-[#405862]/70 max-w-2xl mx-auto mt-2 text-sm">
              Show your support with Dr. Interested merchandise
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <Card className="overflow-hidden border-[#405862]/10 shadow-md hover:shadow-lg transition-all duration-300 group">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#405862]/10 to-transparent z-10"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-2 p-4 w-full h-full">
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex items-center justify-center p-2">
                        <Image
                          src="/tshirt.jpg"
                          alt="Dr. Interested T-Shirt - Healthcare Club Merchandise"
                          width={120}
                          height={120}
                          className="object-contain hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex items-center justify-center p-2">
                        <Image
                          src="/hoodie.jpg"
                          alt="Dr. Interested Hoodie - Healthcare Club Merchandise"
                          width={120}
                          height={120}
                          className="object-contain hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex items-center justify-center p-2">
                        <Image
                          src="/sticker.jpg"
                          alt="Dr. Interested Sticker - Healthcare Club Merchandise"
                          width={120}
                          height={120}
                          className="object-contain hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex items-center justify-center p-2">
                        <Image
                          src="/mug.jpg"
                          alt="Dr. Interested Mug - Healthcare Club Merchandise"
                          width={120}
                          height={120}
                          className="object-contain hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-5 flex flex-col">
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-[#405862]">Dr. Interested Merchandise</h3>
                    <p className="text-[#405862]/80 mb-4">
                      Support our mission while showing off your passion for healthcare! Our merchandise collection
                      includes t-shirts, hoodies, stickers, mugs, and more - all featuring our iconic Dr. Interested
                      designs.
                    </p>

                    <div className="space-y-3 mb-5">
                      <div className="flex items-center text-sm text-[#405862]/80">
                        <Tag className="h-4 w-4 mr-2 text-[#4ecdc4]" />
                        <span>High-quality apparel and accessories</span>
                      </div>
                      <div className="flex items-center text-sm text-[#405862]/80">
                        <ShoppingBag className="h-4 w-4 mr-2 text-[#4ecdc4]" />
                        <span>Multiple designs and colors available</span>
                      </div>
                      <div className="flex items-center text-sm text-[#405862]/80">
                        <ShoppingCart className="h-4 w-4 mr-2 text-[#4ecdc4]" />
                        <span>Proceeds support our educational programs</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <Button className="w-full bg-[#405862] hover:bg-[#334852] group" asChild>
                      <Link
                        href="https://www.teepublic.com/user/dr-interested"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Our TeePublic Store
                        <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </>
  )
}
