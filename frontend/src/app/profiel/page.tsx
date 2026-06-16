'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  User,
  Mail,
  ChevronLeft,
  Bookmark,
  FileText,
  LogOut,
  Shield,
  Pencil,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Clock,
  FileCheck,
  Linkedin,
  AlignLeft,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { getProfileByEmail } from '@/lib/api/applications';
import type { ProfileDto } from '@/types/api';

function ProfileContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    setProfileLoading(true);
    getProfileByEmail(user.email)
      .then((p) => setProfile(p))
      .catch(() => setProfile(null))
      .finally(() => setProfileLoading(false));
  }, [user?.email, searchParams.get('updated')]);

  function handleLogout() {
    logout();
    router.push('/');
  }

  if (!user) return null;

  const joinDate = new Date(user.createdAt).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const displayName =
    profile?.firstName && profile?.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : user.email;

  function getInitials(): string {
    if (profile?.firstName && profile?.lastName) {
      return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
    }
    return user!.email.slice(0, 2).toUpperCase();
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/vacatures"
            className="inline-flex items-center text-slate-500 hover:text-sky-600 font-medium transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Terug naar vacatures
          </Link>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
            <User className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Mijn Profiel</h1>
            <p className="text-slate-500 text-sm">Je account bij ZorgWerkwijzer</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profiel card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-sky-600 to-sky-500 p-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-3">
                <span className="text-white text-2xl font-bold">{getInitials()}</span>
              </div>
              <h2 className="text-xl font-bold text-white">{displayName}</h2>
              <p className="text-sky-100 text-sm mt-1">Lid sinds {joinDate}</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Email */}
              <div className="flex items-center gap-3 text-slate-600">
                <Mail className="w-5 h-5 text-slate-400 shrink-0" />
                <span>{user.email}</span>
              </div>

              {/* Rol */}
              <div className="flex items-center gap-3 text-slate-600">
                <Shield className="w-5 h-5 text-slate-400 shrink-0" />
                <span className="capitalize">
                  {user.role === 'ROLE_ADMIN' ? 'Beheerder' : 'Gebruiker'}
                </span>
              </div>

              {/* Profieldata */}
              {profileLoading ? (
                <div className="pt-2">
                  <div className="h-4 bg-slate-100 rounded animate-pulse w-48 mb-3" />
                  <div className="h-4 bg-slate-100 rounded animate-pulse w-36" />
                </div>
              ) : profile ? (
                <>
                  {/* Telefoon */}
                  {profile.phoneNumber && (
                    <div className="flex items-center gap-3 text-slate-600">
                      <Phone className="w-5 h-5 text-slate-400 shrink-0" />
                      <span>{profile.phoneNumber}</span>
                    </div>
                  )}

                  {/* Woonplaats */}
                  {profile.city && (
                    <div className="flex items-center gap-3 text-slate-600">
                      <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                      <span>
                        {profile.city}
                        {profile.postalCode ? `, ${profile.postalCode}` : ''}
                      </span>
                    </div>
                  )}

                  {/* Functie */}
                  {profile.profession && (
                    <div className="flex items-center gap-3 text-slate-600">
                      <Briefcase className="w-5 h-5 text-slate-400 shrink-0" />
                      <span>{profile.profession}</span>
                    </div>
                  )}

                  {/* Opleiding */}
                  {profile.education && (
                    <div className="flex items-center gap-3 text-slate-600">
                      <GraduationCap className="w-5 h-5 text-slate-400 shrink-0" />
                      <span>{profile.education}</span>
                    </div>
                  )}

                  {/* Werkervaring */}
                  {profile.experienceYears != null && (
                    <div className="flex items-center gap-3 text-slate-600">
                      <Clock className="w-5 h-5 text-slate-400 shrink-0" />
                      <span>
                        {profile.experienceYears}{' '}
                        {profile.experienceYears === 1 ? 'jaar' : 'jaar'} werkervaring
                      </span>
                    </div>
                  )}

                  {/* LinkedIn */}
                  {profile.linkedinUrl && (
                    <div className="flex items-center gap-3 text-slate-600">
                      <Linkedin className="w-5 h-5 text-slate-400 shrink-0" />
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-600 hover:underline truncate"
                      >
                        LinkedIn profiel
                      </a>
                    </div>
                  )}

                  {/* CV status */}
                  <div className="flex items-center gap-3 text-slate-600">
                    <FileCheck className="w-5 h-5 text-slate-400 shrink-0" />
                    {profile.cvUrl ? (
                      <a
                        href={profile.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-600 hover:underline"
                      >
                        CV bekijken / downloaden
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">Nog geen CV geüpload</span>
                    )}
                  </div>

                  {/* Bio */}
                  {profile.bio && (
                    <div className="flex items-start gap-3 text-slate-600 pt-1">
                      <AlignLeft className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                      <p className="text-sm leading-relaxed">{profile.bio}</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-slate-400 text-sm pt-2">
                  Vul je profiel aan om meer informatie te tonen.
                </p>
              )}
            </div>
          </div>

          {/* Profiel bewerken knop */}
          <Link
            href="/profiel/bewerken"
            className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-2xl transition-colors text-sm"
          >
            <Pencil className="w-4 h-4" />
            Profiel bewerken
          </Link>

          {/* Snelkoppelingen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/mijn-sollicitaties"
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex items-center gap-4 hover:border-sky-300 hover:shadow-md transition-all group"
            >
              <div className="w-11 h-11 bg-emerald-100 rounded-2xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Mijn Sollicitaties</p>
                <p className="text-sm text-slate-500">Bekijk de status</p>
              </div>
            </Link>

            <Link
              href="/mijn-vacatures"
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex items-center gap-4 hover:border-sky-300 hover:shadow-md transition-all group"
            >
              <div className="w-11 h-11 bg-sky-100 rounded-2xl flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                <Bookmark className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Opgeslagen Vacatures</p>
                <p className="text-sm text-slate-500">Jouw shortlist</p>
              </div>
            </Link>
          </div>

          {/* Uitloggen */}
          <button
            onClick={handleLogout}
            className="w-full border border-slate-200 text-slate-500 font-medium py-3 rounded-2xl hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all text-sm flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Uitloggen
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_ADMIN']} unauthorizedRedirect="/dashboard">
      <ProfileContent />
    </ProtectedRoute>
  );
}
