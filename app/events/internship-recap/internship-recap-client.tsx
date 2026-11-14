"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ZoomIn, ZoomOut, X, Maximize2 } from "lucide-react"
import ScrollToTop from "@/components/scroll-to-top"
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog"

export default function InternshipRecapClientPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0)

    return () => {
      setZoomLevel(1)
    }
  }, [])

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5))
  }

  const handleReset = () => {
    setZoomLevel(1)
  }

  const projects = [
    {
      id: 1,
      title: "CT Scans (Computed Tomography)",
      role: "CT Technologists",
      contributors: ["Jessica Konni"],
      image: "/ctscan.png",
      description: "An exploration of CT scan technology, how it works, and its applications in modern medicine.",
    },
    {
      id: 2,
      title: "Ultrasound",
      role: "Sonographers",
      contributors: ["Makayla Anderson", "Siena Ramos"],
      image: "/ultrasound.png",
      description:
        "A comprehensive look at ultrasound technology, its history, and the role of sonographers in healthcare.",
    },
    {
      id: 3,
      title: "PET Scans (Positron Emission Tomography)",
      role: "Nuclear Medicine Technologists",
      contributors: ["Garima Pal", "Syeda Rida Zehra"],
      image: "/petscans.png",
      description:
        "An overview of PET scan technology, how it works to detect diseases, and the role of nuclear medicine technologists.",
    },
    {
      id: 4,
      title: "Robotic Surgery",
      role: "Surgical Technologists",
      contributors: ["Chloe Joi Padilla", "Maliha Metla"],
      image: "/surgery.png",
      description:
        "An exploration of robotic surgery technology, its benefits, and the role of surgical technologists in the operating room.",
    },
    {
      id: 5,
      title: "DNA Sequencing",
      role: "Genetic Technologists",
      contributors: ["Tia Abualsamh", "Shraddha Bhagwat", "Nicolas Simon-Steel"],
      image: "/dnasquence.png",
      description:
        "A deep dive into DNA sequencing technology, its applications in medicine and research, and the role of genetic technologists.",
    },
    {
      id: 6,
      title: "3D Bioprinting",
      role: "Biomedical Technologists",
      contributors: ["Ridhi Goyal", "Paulina Arenas"],
      image: "/bioprinting.png",
      description:
        "An exploration of 3D bioprinting technology, its potential in regenerative medicine, and the role of biomedical technologists.",
    },
  ]

  return (
    <div>
      <ScrollToTop />
      <section className="hero-section bg-[#f5f1eb] py-12">
        <div className="container">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/events" className="text-[#405862] hover:text-teal-deep transition-colors flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Events
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-center text-[#405862]">Medical-Technological Competition Recap</h1>
          <p className="text-center text-[#405862] mt-4 max-w-3xl mx-auto">
            Our Medical-Technological Competition brought together talented students to explore various healthcare
            technologies. Participants researched different medical technologies and created informative presentations
            about their findings. Below are the amazing projects completed by our interns.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid gap-8">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden border-[#405862] shadow-md">
                <div className="grid md:grid-cols-2 gap-6 p-6">
                  <div className="flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-[#405862] mb-2">{project.title}</h2>
                      <h3 className="text-lg font-medium text-teal-deep mb-4">{project.role}</h3>
                      <p className="text-[#405862] mb-4">{project.description}</p>

                      <div className="mb-4">
                        <h4 className="font-semibold text-[#405862] mb-2">Contributors:</h4>
                        <ul className="list-disc list-inside text-[#405862]">
                          {project.contributors.map((contributor, index) => (
                            <li key={index}>{contributor}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div
                    className="relative min-h-[300px] rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => setSelectedImage(project.image)}
                  >
                    <Image
                      src={project.image || "/placeholder.svg?height=400&width=300"}
                      alt={project.title}
                      fill
                      className="object-contain transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-[#405862] text-white p-2 rounded-full">
                        <Maximize2 className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedImage(null)
            setZoomLevel(1)
          }
        }}
      >
        <DialogContent className="max-w-5xl w-[90vw] max-h-[90vh] p-0 overflow-hidden bg-white">
          <div className="relative h-[80vh] w-full">
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <Button variant="outline" size="icon" className="bg-white rounded-full" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-white rounded-full" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-white rounded-full" onClick={handleReset}>
                <Maximize2 className="h-4 w-4" />
              </Button>
              <DialogClose asChild>
                <Button variant="outline" size="icon" className="bg-white rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
            <div
              className="h-full w-full overflow-auto"
              style={{
                cursor: zoomLevel > 1 ? "move" : "default",
              }}
            >
              <div
                className="min-h-full min-w-full flex items-center justify-center"
              >
                {selectedImage && (
                  <div
                    style={{
                      transform: `scale(${zoomLevel})`,
                      transition: "transform 0.2s ease",
                      transformOrigin: "center center",
                    }}
                  >
                    <Image
                      src={selectedImage || "/placeholder.svg"}
                      alt="Project poster"
                      width={1000}
                      height={1000}
                      className="object-contain max-w-none"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <section className="py-12 bg-[#405862] text-white">
        <div className="container text-center">
          <h2 className="text-2xl font-bold mb-4">Interested in Future Competitions?</h2>
          <p className="max-w-2xl mx-auto mb-6">
            Our competitions provide valuable experience and knowledge in various healthcare fields. Join our mailing
            list to be notified about upcoming opportunities.
          </p>
          <Button className="bg-[#4ecdc4] hover:bg-[#3dbdb5] text-white" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
