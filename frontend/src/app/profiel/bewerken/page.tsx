'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  User,
  Save,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { getProfileByEmail, updateProfile, uploadCv } from '@/lib/api/applications';
import type { ProfileDto, ProfileUpdateRequest } from '@/types/api';

function ProfileEditContent() {
  const { user } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Formuliervelden
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [profession, setProfession] = useState('');
  const [education, setEducation] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [bio, setBio] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [availability, setAvailability] = useState('');
  const [desiredHours, setDesiredHours] = useState('');
  const [cvUrl, setCvUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.email) return;
    getProfileByEmail(user.email).then((p) => {
      if (p) {
        setProfile(p);
        setFirstName(p.firstName ?? '');
        setLastName(p.lastName ?? '');
        setPhoneNumber(p.phoneNumber ?? '');
        setCity(p.city ?? '');
        setPostalCode(p.postalCode ?? '');
        setProfession(p.profession ?? '');
        setEducation(p.education ?? '');
        setExperienceYears(p.experienceYears != null ? String(p.experienceYears) : '');
        setBio(p.bio ?? '');
        setLinkedinUrl(p.linkedinUrl ?? '');
        setAvailability(p.availability ?? '');
        setDesiredHours(p.desiredHours != null ? String(p.desiredHours) : '');
        setCvUrl(p.cvUrl);
      }
      setLoading(false);
    });
  }, [user?.email]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const payload: ProfileUpdateRequest = {
      firstName,
      lastName,
      email: profile.email,
      phoneNumber: phoneNumber || null,
      isSearching: profile.isSearching,
      cvUrl: cvUrl || null,
      city: city || null,
      postalCode: postalCode || null,
      profession: profession || null,
      education: education || null,
      experienceYears: experienceYears ? parseInt(experienceYears, 10) : null,
      bio: bio || null,
      linkedinUrl: linkedinUrl || null,
      availability: availability || null,
      desiredHours: desiredHours ? parseInt(desiredHours, 10) : null,
    };

    const result = await updateProfile(profile.id, payload);
    setSaving(false);

    if (result.success) {
      setProfile(result.data);
      setSuccessMsg('Profiel succesvol opgeslagen.');
      setTimeout(() => {
        setSuccessMsg(null);
        router.push('/profiel?updated=1');
      }, 1500);
    } else {
      setErrorMsg(result.error);
    }
  }

  async function handleCvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Bestand is te groot. Maximum is 5 MB.');
      return;
    }
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      setErrorMsg('Bestandstype niet toegestaan. Gebruik PDF of DOCX.');
      return;
    }

    setUploading(true);
    setErrorMsg(null);

    const result = await uploadCv(file);
    if (result.success) {
      setCvUrl(result.cvUrl);
      // cv_url opslaan in profiel
      const saveResult = await updateProfile(profile.id, {
        firstName,
        lastName,
        email: profile.email,
        phoneNumber: phoneNumber || null,
        isSearching: profile.isSearching,
        cvUrl: result.cvUrl,
        city: city || null,
        postalCode: postalCode || null,
        profession: profession || null,
        education: education || null,
        experienceYears: experienceYears ? parseInt(experienceYears, 10) : null,
        bio: bio || null,
        linkedinUrl: linkedinUrl || null,
        availability: availability || null,
        desiredHours: desiredHours ? parseInt(desiredHours, 10) : null,
      });
      if (saveResult.success) {
        setProfile({ ...saveResult.data, cvUrl: result.cvUrl });
        setCvUrl(result.cvUrl);
        setSuccessMsg('CV succesvol geüpload en opgeslagen.');
        setTimeout(() => {
          setSuccessMsg(null);
          router.push('/profiel?updated=1');
        }, 1500);
      }
    } else {
      setErrorMsg(result.error);
    }
    setUploading(false);
    // reset input
    e.target.value = '';
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <p className="text-slate-600 mb-4">Geen profiel gevonden voor dit account.</p>
          <Link href="/profiel" className="text-sky-600 hover:underline font-medium">
            Terug naar profiel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/profiel"
            className="inline-flex items-center text-slate-500 hover:text-sky-600 font-medium transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Terug naar profiel
          </Link>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
            <User className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Profiel bewerken</h1>
            <p className="text-slate-500 text-sm">Houd je profiel up-to-date voor werkgevers</p>
          </div>
        </div>

        {/* Meldingen */}
        {successMsg && (
          <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl px-5 py-4">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Persoonlijke gegevens */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-5">Persoonlijke gegevens</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Voornaam <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Anna"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Achternaam <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="de Vries"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Telefoonnummer
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="0612345678"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Woonplaats
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Maastricht"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Postcode
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="6211 AB"
                />
              </div>
            </div>
          </div>

          {/* Professionele gegevens */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-5">Professionele gegevens</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Functie
                </label>
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Verpleegkundige"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Opleiding
                </label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="HBO Verpleegkunde"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Werkervaring (jaren)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Gewenste uren per week
                </label>
                <input
                  type="number"
                  min="1"
                  max="80"
                  value={desiredHours}
                  onChange={(e) => setDesiredHours(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="32"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Beschikbaar vanaf
                </label>
                <input
                  type="text"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Per direct"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/jouw-naam"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-5">Over jezelf</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Korte bio
              </label>
              <textarea
                rows={5}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                placeholder="Vertel werkgevers wie je bent, wat je drijft en wat je zoekt..."
              />
              <p className="text-xs text-slate-400 mt-1">{bio.length}/1000 tekens</p>
            </div>
          </div>

          {/* CV upload */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-5">CV</h2>
            {cvUrl ? (
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">CV geüpload</p>
                    <a
                      href={cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-sky-600 hover:underline"
                    >
                      Bekijken →
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 mb-4">Nog geen CV geüpload.</p>
            )}
            <label className="inline-flex items-center gap-2 cursor-pointer bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors">
              <Upload className="w-4 h-4" />
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploaden…
                </>
              ) : cvUrl ? (
                'CV vervangen'
              ) : (
                'CV uploaden'
              )}
              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={handleCvUpload}
                disabled={uploading}
              />
            </label>
            <p className="text-xs text-slate-400 mt-2">PDF of DOCX, maximaal 5 MB</p>
          </div>

          {/* Opslaan */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-7 py-3 rounded-2xl transition-colors"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? 'Opslaan…' : 'Profiel opslaan'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/profiel')}
              className="text-slate-500 hover:text-slate-700 font-medium text-sm transition-colors"
            >
              Annuleren
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProfileEditPage() {
  return (
    <ProtectedRoute>
      <ProfileEditContent />
    </ProtectedRoute>
  );
}
