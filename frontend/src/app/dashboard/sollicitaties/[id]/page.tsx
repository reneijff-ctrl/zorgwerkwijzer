'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Clock,
  Linkedin,
  FileText,
  MessageSquare,
  Eye,
  UserCheck,
  XCircle,
  Star,
  Loader2,
} from 'lucide-react';
import { getDashboardApplicationById, updateApplicationStatus } from '@/lib/api/employer-dashboard';
import type { DashboardApplicationDto } from '@/types/dashboard';
import { APPLICATION_STATUS_LABELS } from '@/types/api';
import type { ApplicationStatus } from '@/types/api';

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  SUBMITTED: 'bg-sky-100 text-sky-700',
  REVIEWED: 'bg-amber-100 text-amber-700',
  INVITED: 'bg-violet-100 text-violet-700',
  REJECTED: 'bg-red-100 text-red-700',
  HIRED: 'bg-emerald-100 text-emerald-700',
};

const STATUS_ACTIONS: {
  label: string;
  status: ApplicationStatus;
  icon: React.ReactNode;
  className: string;
}[] = [
  {
    label: 'Markeer als bekeken',
    status: 'REVIEWED',
    icon: <Eye className="w-4 h-4" />,
    className: 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200',
  },
  {
    label: 'Uitnodigen',
    status: 'INVITED',
    icon: <UserCheck className="w-4 h-4" />,
    className: 'bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200',
  },
  {
    label: 'Aannemen',
    status: 'HIRED',
    icon: <Star className="w-4 h-4" />,
    className: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200',
  },
  {
    label: 'Afwijzen',
    status: 'REJECTED',
    icon: <XCircle className="w-4 h-4" />,
    className: 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200',
  },
];

export default function ApplicationDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [application, setApplication] = useState<DashboardApplicationDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getDashboardApplicationById(id).then((data) => {
      setApplication(data);
      setLoading(false);
    });
  }, [id]);

  async function handleStatusUpdate(status: ApplicationStatus) {
    if (!application) return;
    setUpdating(true);
    setErrorMsg(null);
    const result = await updateApplicationStatus(application.id, status);
    if (result.success) {
      setApplication(result.data);
    } else {
      setErrorMsg(result.error);
    }
    setUpdating(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 mb-4">Sollicitatie niet gevonden.</p>
        <Link href="/dashboard/sollicitaties" className="text-sky-600 hover:underline font-medium">
          Terug naar overzicht
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link
          href="/dashboard/sollicitaties"
          className="inline-flex items-center text-slate-500 hover:text-sky-600 font-medium transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Terug naar sollicitaties
        </Link>
      </nav>

      {/* Foutmelding */}
      {errorMsg && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Kandidaatkaart */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-sky-500 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {application.applicantName.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{application.applicantName}</h1>
                {application.applicantProfession && (
                  <p className="text-sky-100 text-sm mt-0.5">{application.applicantProfession}</p>
                )}
              </div>
            </div>
            <span
              className={`inline-flex text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[application.status]}`}
            >
              {APPLICATION_STATUS_LABELS[application.status]}
            </span>
          </div>
        </div>

        {/* Contactgegevens */}
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Contactgegevens
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 text-slate-700">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <a href={`mailto:${application.applicantEmail}`} className="text-sm hover:text-sky-600 transition-colors">
                {application.applicantEmail}
              </a>
            </div>
            {application.applicantPhone && (
              <div className="flex items-center gap-3 text-slate-700">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <a href={`tel:${application.applicantPhone}`} className="text-sm hover:text-sky-600 transition-colors">
                  {application.applicantPhone}
                </a>
              </div>
            )}
            {application.applicantCity && (
              <div className="flex items-center gap-3 text-slate-700">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-sm">{application.applicantCity}</span>
              </div>
            )}
            {application.applicantLinkedinUrl && (
              <div className="flex items-center gap-3 text-slate-700">
                <Linkedin className="w-4 h-4 text-slate-400 shrink-0" />
                <a
                  href={application.applicantLinkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-sky-600 hover:underline truncate"
                >
                  LinkedIn profiel
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Professionele info */}
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Professionele informatie
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {application.applicantEducation && (
              <div className="flex items-center gap-3 text-slate-700">
                <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-sm">{application.applicantEducation}</span>
              </div>
            )}
            {application.applicantExperienceYears != null && (
              <div className="flex items-center gap-3 text-slate-700">
                <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-sm">{application.applicantExperienceYears} jaar werkervaring</span>
              </div>
            )}
            {application.applicantAvailability && (
              <div className="flex items-center gap-3 text-slate-700">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-sm">Beschikbaar: {application.applicantAvailability}</span>
              </div>
            )}
            {application.applicantDesiredHours != null && (
              <div className="flex items-center gap-3 text-slate-700">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-sm">{application.applicantDesiredHours} uur per week gewenst</span>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        {application.applicantBio && (
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Over de kandidaat
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {application.applicantBio}
            </p>
          </div>
        )}

        {/* Motivatiebrief */}
        {application.coverLetter && (
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Motivatiebrief
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {application.coverLetter}
            </p>
          </div>
        )}

        {/* CV download */}
        {application.applicantCvUrl && (
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              CV
            </h2>
            <a
              href={application.applicantCvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
            >
              <FileText className="w-4 h-4" />
              CV downloaden
            </a>
          </div>
        )}

        {/* Vacature info */}
        <div className="p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Gesolliciteerd op
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">{application.vacancyTitle}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {new Date(application.appliedAt).toLocaleDateString('nl-NL', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <Link
              href={`/vacature/${application.vacancySlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-sky-600 hover:underline"
            >
              Bekijk vacature →
            </Link>
          </div>
        </div>
      </div>

      {/* Statuswijziging */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Status wijzigen
        </h2>
        <div className="flex flex-wrap gap-3">
          {STATUS_ACTIONS.filter((action) => action.status !== application.status).map((action) => (
            <button
              key={action.status}
              disabled={updating}
              onClick={() => handleStatusUpdate(action.status)}
              className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${action.className}`}
            >
              {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : action.icon}
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
