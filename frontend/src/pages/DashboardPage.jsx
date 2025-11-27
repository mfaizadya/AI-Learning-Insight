import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, BarChart3 } from "lucide-react";


export const DashboardPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           
      {/*CARD 1: STREAK (Hari Belajar)*/}
      <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden relative rounded-3xl">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#EDE8FA] rounded-full"></div>  
        <CardContent className="p-6 flex flex-col justify-center h-full relative z-10">
          <div className="flex items-baseline gap-2">
              <span className="text-7xl font-extrabold text-[#3b2f6e]">30</span>
              <span className="text-2xl text-[#3b2f6e] font-bold">Days</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg text-gray-500 font-medium">Learning Streak</span>
            <span className="text-2xl filter drop-blur-sm">🔥</span> 
          </div>
        </CardContent>
      </Card>

      {/* CARD 2: GAYA BELAJAR (Visual)*/}
      <Card className="bg-[#EDE8FA] border-none shadow-sm hover:shadow-md transition-shadow rounded-3xl">
        <CardContent className="p-6 flex flex-col justify-between h-full gap-4">
          <div className="flex items-center justify-between px-2 mt-4">
            <h3 className="text-[#3F3370] text-xl font-medium leading-tight">
              Gaya<br />
              belajarmu:
            </h3>
            <Eye className="h-16 w-16 text-[#3F3370]" strokeWidth={1.5} />
          </div>
          <div className="w-full bg-[#3F3370] text-white py-4 px-4 rounded-2xl text-center text-lg font-bold shadow-lg shadow-purple-900/10 cursor-default mt-2">
            Visual Learner
          </div>
        </CardContent>
      </Card>

      {/* CARD 3: POLA BELAJAR */}
      <Card className="bg-[#EDE8FA] border-none shadow-sm hover:shadow-md transition-shadow rounded-3xl">
        <CardContent className="p-6 flex items-center justify-between h-full">
          <div>
            <p className="text-gray-600 font-medium text-sm">Pola belajarmu:</p>
            <h3 className="text-2xl font-bold text-[#3F3370] mt-2 leading-tight">
              Consistent<br/>Learner
            </h3>
          </div>
          <div className="bg-[#3F3370] p-4 rounded-2xl shadow-lg shadow-purple-900/10 flex items-center justify-center">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
        </CardContent>
      </Card>

      {/* CARD 4: ACTIONABLE INSIGHT*/}
      <Card className="md:col-span-2 bg-[#FDFDFF] border border-purple-100 shadow-sm relative overflow-hidden rounded-3xl">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#3F3370]"></div> {/* Aksen garis kiri */}
        
        <CardHeader className="pb-2 pt-6 pl-8">
          <CardTitle className="text-[#3F3370] flex items-center gap-3 text-lg font-bold">
            <span className="bg-[#EDE8FA] p-1.5 rounded-lg">💡</span> 
            Actionable Insight untukmu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pl-8 pr-6 pb-6">
          <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:border-purple-100 transition-colors">
            <h4 className="font-bold text-gray-800 text-sm mb-1">Anda merupakan Visual Learner:</h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Oleh karena itu, maksimalkan materi belajar yang berbasis visual seperti diagram, peta konsep, dan video pembelajaran. Hindari teks panjang tanpa ilustrasi.
            </p>
          </div>
          <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:border-purple-100 transition-colors">
            <h4 className="font-bold text-gray-800 text-sm mb-1">Konsistensi Anda Sangat Baik:</h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Anda telah belajar selama 30 hari berturut-turut. Pertahankan ritme ini, namun jangan lupa untuk mengambil jeda istirahat (pomodoro) agar tidak burnout.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CARD 5: STATISTIK PIE CHART*/}
      <Card className="bg-white shadow-sm border-none flex flex-col rounded-3xl">
        <CardHeader className="pb-2 pt-6 pl-6">
          <CardTitle className="text-base font-bold text-[#3F3370]">Statistik Gaya Belajar</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center p-6">
          
          <div className="flex items-center gap-6">
              <div className="relative w-32 h-32 rounded-full bg-gray-100 shadow-inner flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#3F3370]" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 20% 100%)'}}></div>
                <div className="absolute inset-0 rounded-full bg-[#A090E0]" style={{clipPath: 'polygon(0 0, 20% 100%, 0 100%)'}}></div>
                <div className="absolute w-16 h-16 bg-white rounded-full shadow-sm z-10"></div>
              </div>

              {/* Legenda */}
              <div className="text-xs space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#3F3370] rounded-full"></span> 
                  <span className="font-medium text-gray-700">Visual 90%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#A090E0] rounded-full"></span> 
                  <span className="font-medium text-gray-500">Auditori 7%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-gray-200 rounded-full"></span> 
                  <span className="font-medium text-gray-400">Kinestetik 3%</span>
                </div>
              </div>
          </div>

        </CardContent>
      </Card>

    </div>
  )
}

// Untuk konsistensi dengan import di App.jsx
export default DashboardPage;