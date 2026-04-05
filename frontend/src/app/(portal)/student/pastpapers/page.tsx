'use client';

import { useEffect, useState } from 'react';
import { pastPaperService, PastPaper } from '@/services/pastpaper.service';
import { studentPortalService } from '@/services/student-portal.service';
import { BookMarked, Filter, Download } from 'lucide-react';

export default function StudentPastPapersPage() {
  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');

  useEffect(() => {
    // When component mounts, determine the student's current grade to use as default filter
    const fetchInitialData = async () => {
      try {
        const { studentProfile } = await studentPortalService.getMyProfile();
        if (studentProfile && studentProfile.grade) {
          setSelectedGrade(studentProfile.grade);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    setLoading(true);
    pastPaperService.getPastPapers(selectedGrade, 'all')
      .then(setPapers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedGrade]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Past Papers</h1>
          <p className="text-slate-500 mt-1">Download and study past examination papers</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Filter size={18} className="text-rahula-blue" />
          <h3 className="font-semibold text-slate-700 mr-2">Filter by Grade:</h3>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-white hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20 transition-all"
          >
            <option value="all">All Grades</option>
            {[...Array(13)].map((_, i) => (
              <option key={i+1} value={i+1}>Grade {i+1}</option>
            ))}
          </select>
        </div>
        <div className="text-sm text-slate-500 font-medium">
          {papers.length} {papers.length === 1 ? 'Paper' : 'Papers'} Available
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-rahula-blue rounded-full animate-spin"></div>
        </div>
      ) : papers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookMarked size={28} className="text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium">No past papers found</p>
          <p className="text-sm text-slate-400 mt-1">
            {selectedGrade !== 'all' 
              ? `There are no papers uploaded currently for Grade ${selectedGrade}. Try selecting 'All Grades'.`
              : 'Your teachers have not uploaded any papers yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {papers.map((paper) => (
            <div key={paper.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-rahula-blue mb-4 group-hover:scale-110 group-hover:bg-blue-100 transition-all">
                <BookMarked size={24} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2 flex-grow">{paper.title}</h3>
              <div className="space-y-1 mb-5">
                <p className="text-sm font-semibold text-rahula-blue bg-blue-50 px-2.5 py-1 rounded-md inline-block">Grade {paper.grade}</p>
                <p className="text-sm text-slate-500 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                  Year: {paper.year}
                </p>
                {paper.term && (
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                    Term: {paper.term}
                  </p>
                )}
              </div>
              <a 
                href={paper.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-rahula-blue font-medium rounded-xl flex items-center justify-center gap-2 transition-colors mt-auto border border-slate-100 hover:border-blue-100"
              >
                <Download size={18} />
                <span>Download PDF</span>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
