"use client"

import { useState } from "react"
import jsPDF from "jspdf"

const templateMap: Record<string, string> = {
  insetpassword123: "/certificate-rpc.png",
  webinarsarefun67: "/certificate-webinar.png",
  iloveparticipation: "/partcert.png",
  diseasestocure2026: "/diseasedisccert2.png",
}

function CertificateForm() {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [template, setTemplate] = useState<string | null>(null)

  const handleGenerate = () => {
    const foundTemplate = templateMap[password]
    if (!foundTemplate) {
      alert("Invalid password")
      return
    }
    setTemplate(foundTemplate)
  }

  const handleDownload = async () => {
    if (!template) return

    const pdf = new jsPDF("landscape", "pt", "a4")
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    const img = new Image()
    img.src = template
    img.onload = () => {
      const ratio = Math.min(pdfWidth / img.width, pdfHeight / img.height)
      const imgWidth = img.width * ratio
      const imgHeight = img.height * ratio
      const imgX = (pdfWidth - imgWidth) / 2
      const imgY = (pdfHeight - imgHeight) / 2

      pdf.addImage(img, "PNG", imgX, imgY, imgWidth, imgHeight)

      pdf.setFontSize(32)
      pdf.setFont("helvetica", "bold")
      pdf.text(name, pdfWidth / 2, pdfHeight / 2 + 20, {
        align: "center",
      })
      pdf.save(`${name}-certificate.pdf`)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {/* Input Form */}
      <input
        type="text"
        placeholder="Enter your name"
        className="border p-2 rounded w-64"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter password (should be provided)"
        className="border p-2 rounded w-64 text-xs"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-[#334852] hover:bg-[#405862] transition-colours duration-300 text-white px-4 py-2 rounded"
        onClick={handleGenerate}
      >
        Generate Certificate
      </button>

      {/* Certificate Preview */}
      {template && (
        <div className="mt-6 flex flex-col items-center gap-4">
          <div
            id="certificate"
            className="relative w-[800px] h-[600px] border shadow-lg"
            style={{
              backgroundImage: `url(${template})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <span className="absolute top-72 left-1/2 transform -translate-x-1/2 text-3xl font-bold text-black">
              {name}
            </span>
          </div>
          <button
            className=" bg-[#3DBDB5] hover:bg-[#4DCCC3] transition-colours duration-300 text-white px-4 py-2 rounded"
            onClick={handleDownload}
          >
            Download as PDF
          </button>
        </div>
      )}
    </div>
  )
}

export default function CertificateBuilderPage() {
  return (
    <div>
      <div className="my-6" aria-hidden="true" />
      <CertificateForm />
    </div>
  )
}
