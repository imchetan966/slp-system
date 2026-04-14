'use client';
import { useState } from 'react';
import styles from './RegistrationForm.module.css';
import { useRouter } from 'next/navigation';


interface FormData {
  fullName: string;
  fatherName: string;
  dob: string;
  studentMobile: string;
  parentMobile: string;
  email: string;
  qualification: string;
  city: string;
  skillInterest: string;
  hasLaptop: string;
  experience: string;
  whyJoin: string;
  agreedToTerms: boolean;
  photo: File | null;
}

export default function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    fatherName: '',
    dob: '',
    studentMobile: '',
    parentMobile: '',
    email: '',
    qualification: '',
    city: '',
    skillInterest: '',
    hasLaptop: '',
    experience: '',
    whyJoin: '',
    agreedToTerms: false,
    photo: null,
  });


  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [tempAgreed, setTempAgreed] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);
  const router = useRouter();
  const UPI_ID = '9257676694@paytm';

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
    } else if (type === 'file') {
      setFormData((prev) => ({ ...prev, photo: target.files?.[0] ?? null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 2500);
    });
  };

  const handleSubmitClick = (e: React.FormEvent) => {
    e.preventDefault();
    setTempAgreed(false);
    setShowTermsModal(true);
  };

  const handleAgreeAndSubmit = async () => {
    if (!tempAgreed) return;
    setFormData((prev) => ({ ...prev, agreedToTerms: true }));
    setShowTermsModal(false);
    setLoading(true);
    setSuccess('');

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'photo' && value) {
          form.append('photo', value as File);
        } else {
          form.append(key, String(value));
        }
      });
      form.append('agreedToTerms', 'true');
      form.append('totalPayable', '399');

      const res = await fetch('/api/register', { method: 'POST', body: form });
      const data = await res.json();

      if (data.success) {
        router.push(`/thank-you?ref=${data.reference}`);
      } else {
        alert('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Network error - please try again');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const TERMS = [
    'The program duration is 45 days, and students are required to maintain regular attendance.',
    'The registration fee is non-refundable once the enrollment is completed.',
    'In case of missed classes, recordings may or may not be provided, depending on availability.',
    'Students are required to complete all assignments and tasks as part of the program.',
    'Maintaining discipline and respectful behavior is mandatory. Any misconduct may result in removal from the program without refund.',
    'Techie Thrives reserves the right to modify schedules or change trainers if required.',
    'Certificates will be awarded only to students who successfully complete the program.',
    'Any selection-based opportunities (team joining, refunds, etc.) are performance-based and not guaranteed.',
    'Students and parents/guardians are advised to fully understand the program details before registration.',
    'In case of any dispute, the decision of Techie Thrives will be final and binding.',
    'Students are expected to actively participate; only attendance does not guarantee results.',
    "Techie Thrives provides learning opportunities; however, results depend on the student's effort and consistency.",
    'Laptop, device, and internet connectivity are the responsibility of the student.',
    "The institute will not be responsible for missed classes due to technical or connectivity issues on the student's end.",
    'Students late will not be provided with extra time or compensation classes.',
    'Continuous absence of 3–5 days may lead to seat cancellation without refund.',
    'All study materials are strictly for enrolled students only and must not be shared or distributed.',
    'Any recorded content (if provided) is for personal use only; resale or forwarding is strictly prohibited.',
    'Any form of misbehavior, disturbance, or negative environment creation may result in immediate removal.',
    "In such cases, the institute's decision will be final, and no refund will be issued.",
    'Any refund (if applicable under specific schemes) will be provided only to selected students based on internal criteria.',
    'All selections are purely merit-based and not guaranteed.',
    'Techie Thrives reserves the right to use student photos/videos for promotional purposes (social media, advertisements, etc.).',
    'In case of any legal matter, the jurisdiction will be Kota, Rajasthan.',
    'Any false claims, misuse, or defamation against the institute may result in legal action.',
    'By registering, the student and parent/guardian confirm that they have read, understood, and agreed to all the terms and conditions.',
  ];

  return (
    <div className={styles.root}>

      {/* ── Terms Modal ───────────────────────────────────── */}
      {showTermsModal && (
        <div className={styles.modalOverlay} onClick={() => setShowTermsModal(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalIconWrap}>📋</div>
              <div>
                <h2 className={styles.modalTitle}>Terms &amp; Conditions</h2>
                <p className={styles.modalSubtitle}>Please read carefully before registering</p>
              </div>
              <button className={styles.modalClose} onClick={() => setShowTermsModal(false)} aria-label="Close">✕</button>
            </div>
            <div className={styles.modalBody}>
              <ol className={styles.termsList}>
                {TERMS.map((term, i) => (
                  <li key={i}>
                    <span className={styles.termNum}>{i + 1}</span>
                    <span>{term}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className={styles.modalFooter}>
              <label className={styles.checkRow}>
                <input
                  type="checkbox"
                  checked={tempAgreed}
                  onChange={(e) => setTempAgreed(e.target.checked)}
                  className={styles.checkbox}
                />
                <span className={styles.checkLabel}>
                  I have read and agree to attend classes regularly and complete all assigned tasks.
                </span>
              </label>
              <button
                className={`${styles.agreeBtn} ${!tempAgreed ? styles.agreeBtnOff : ''}`}
                disabled={!tempAgreed}
                onClick={handleAgreeAndSubmit}
              >
                {loading ? <><span className={styles.spinner} /> Processing…</> : 'Agree & Submit Application →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Nav ───────────────────────────────────────────── */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.navBrand}>
            <img src="/logo.png" alt="logo" className={styles.brandLogo} />
            <span className={styles.brandName}>
              Techie Thrives<span className={styles.brandBadge}>SLP</span>
            </span>
          </div>
          <div className={styles.navLinks}>
            <a href="https://www.techiethrive.com/about" className={styles.navLink}>About</a>
            <a href="https://www.techiethrive.com/services" className={styles.navLink}>Services</a>
            <a href="https://www.techiethrive.com/contact" className={styles.navLink}>Contact</a>
            <a href="#register" className={styles.navCta}>Register Now</a>
          </div>
          <button className={styles.hamburger} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        </div>
        {mobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <a href="#about" className={styles.mobileLink}>About</a>
            <a href="#services" className={styles.mobileLink}>Services</a>
            <a href="#contact" className={styles.mobileLink}>Contact</a>
            <a href="#register" className={styles.mobileCta}>Register Now</a>
          </div>
        )}
      </nav>

      {/* ── Main ──────────────────────────────────────────── */}
      <main className={styles.main} id="register">

        {/* Hero Header */}
        <header className={styles.pageHeader}>
          <div className={styles.headerPill}>🎓 Batch 2025 · Limited Seats</div>
          <h1 className={styles.pageTitle}>
            Skill Learn <span className={styles.titleHighlight}>Program</span>
          </h1>
          <p className={styles.pageSubtitle}>
            Start your professional journey with Techie Thrives SLP.<br />
            Fill in your details below to secure your spot.
          </p>
          <div className={styles.headerStats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>45</span>
              <span className={styles.statLabel}>Days</span>
            </div>
            <div className={styles.statDiv} />
            <div className={styles.stat}>
              <span className={styles.statNum}>1.5h</span>
              <span className={styles.statLabel}>Daily</span>
            </div>
            <div className={styles.statDiv} />
            <div className={styles.stat}>
              <span className={styles.statNum}>₹399</span>
              <span className={styles.statLabel}>Registration</span>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmitClick} className={styles.formWrap}>

          {/* ── Step 1 ────────────────────────────────────── */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.stepBadge}>01</div>
              <div>
                <h2 className={styles.cardTitle}>Basic Details</h2>
                <p className={styles.cardDesc}>Tell us a little about yourself</p>
              </div>
            </div>

            <div className={styles.fieldGrid}>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Full Name <span className={styles.required}>*</span></label>
                <input type="text" name="fullName" required value={formData.fullName}
                  onChange={handleChange} placeholder="Enter your full name" className={styles.input} />
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Student Photo</label>
                <label className={styles.dropzone}>
                  <div className={styles.dropzoneInner}>
                    <span className={styles.dropzoneIcon}>📷</span>
                    <span className={styles.dropzoneText}>
                      {formData.photo
                        ? <strong className={styles.fileName}>{formData.photo.name}</strong>
                        : <><strong>Click to upload</strong> or drag &amp; drop</>}
                    </span>
                    <span className={styles.dropzoneHint}>PNG, JPG, GIF · up to 10 MB</span>
                  </div>
                  <input type="file" name="photo" accept="image/*" className={styles.srOnly} onChange={handleChange} />
                </label>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Fathers Name</label>
                <input type="text" name="fatherName" value={formData.fatherName}
                  onChange={handleChange} placeholder="Father's full name" className={styles.input} />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Date of Birth</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={styles.input} />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Student Mobile</label>
                <input type="tel" name="studentMobile" value={formData.studentMobile}
                  onChange={handleChange} placeholder="+91 XXXXX XXXXX" className={styles.input} />
              </div>

              <div className={styles.field}>
                <label className={`${styles.label} ${styles.labelAccent}`}>
                  Parents Mobile <span className={styles.importantTag}>Important</span>
                </label>
                <input type="tel" name="parentMobile" value={formData.parentMobile}
                  onChange={handleChange} placeholder="+91 XXXXX XXXXX"
                  className={`${styles.input} ${styles.inputAccent}`} />
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Email Address <span className={styles.required}>*</span></label>
                <input type="email" name="email" required value={formData.email}
                  onChange={handleChange} placeholder="you@example.com" className={styles.input} />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Current Qualification</label>
                <select name="qualification" value={formData.qualification} onChange={handleChange} className={styles.select}>
                  <option value="">Select Qualification</option>
                  <option>School Student (9th)</option>
                  <option>School Student (10th)</option>
                  <option>School Student (11th)</option>
                  <option>School Student (12th)</option>
                  <option>College Student (1st Year)</option>
                  <option>College Student (2nd Year)</option>
                  <option>College Student (3rd Year)</option>
                  <option>College Student (4th Year)</option>
                  <option>Other</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>City</label>
                <input type="text" name="city" value={formData.city}
                  onChange={handleChange} placeholder="Your city" className={styles.input} />
              </div>
            </div>
          </section>

          {/* connector */}
          <div className={styles.stepConnector}><span className={styles.stepConnectorLine} /></div>

          {/* ── Step 2 ────────────────────────────────────── */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.stepBadge}>02</div>
              <div>
                <h2 className={styles.cardTitle}>Interest &amp; Background</h2>
                <p className={styles.cardDesc}>Help us personalise your experience</p>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <div className={styles.field}>
                <label className={styles.label}>Which skill excites you most?</label>
                <div className={styles.radioGrid}>
                  {[
                    { skill: 'Coding', emoji: '💻', desc: 'Web & App Dev' },
                    { skill: 'Designing', emoji: '🎨', desc: 'UI/UX & Graphics' },
                    { skill: 'Social Media', emoji: '📣', desc: 'Growth & Content' },
                  ].map(({ skill, emoji, desc }) => (
                    <label key={skill}
                      className={`${styles.radioCard} ${formData.skillInterest === skill ? styles.radioCardActive : ''}`}>
                      <input type="radio" name="skillInterest" value={skill}
                        checked={formData.skillInterest === skill} onChange={handleChange} className={styles.srOnly} />
                      <span className={styles.radioEmoji}>{emoji}</span>
                      <span className={styles.radioLabel}>{skill}</span>
                      <span className={styles.radioDesc}>{desc}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Do you have a laptop available?</label>
                <div className={styles.toggleRow}>
                  {[
                    { val: 'Yes', label: '✓  Yes, I have one' },
                    { val: 'No', label: "✗  No, I don't" },
                  ].map(({ val, label }) => (
                    <label key={val}
                      className={`${styles.toggleChip} ${formData.hasLaptop === val ? styles.toggleChipActive : ''}`}>
                      <input type="radio" name="hasLaptop" value={val}
                        checked={formData.hasLaptop === val} onChange={handleChange} className={styles.srOnly} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Previous Experience <span className={styles.optional}>(Optional)</span></label>
                <input type="text" name="experience" value={formData.experience} onChange={handleChange}
                  placeholder="e.g. Basic HTML, Photoshop basics..." className={styles.input} />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Why do you want to join this program?</label>
                <textarea name="whyJoin" rows={4} value={formData.whyJoin} onChange={handleChange}
                  placeholder="Tell us about your goals and what excites you about this program..."
                  className={styles.textarea} />
              </div>
            </div>
          </section>

          {/* connector */}
          <div className={styles.stepConnector}><span className={styles.stepConnectorLine} /></div>

          {/* ── Step 3 ────────────────────────────────────── */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.stepBadge}>03</div>
              <div>
                <h2 className={styles.cardTitle}>Payment</h2>
                <p className={styles.cardDesc}>Pay your registration fee to confirm your seat</p>
              </div>
            </div>

            <div className={styles.paymentBody}>
              {/* Fee banner */}
              <div className={styles.feeBanner}>
                <div>
                  <p className={styles.feeBannerLabel}>Registration Fee</p>
                  <p className={styles.feeBannerSub}>One-time · Non-refundable</p>
                </div>
                <span className={styles.feeBannerAmount}>₹399</span>
              </div>

              {/* UPI */}
              <div className={styles.upiBlock}>
                <div className={styles.upiHeader}>
                  <span>⚡</span>
                  <span className={styles.upiTitle}>Pay via UPI</span>
                </div>
                <div className={styles.upiRow}>
                  <code className={styles.upiId}>{UPI_ID}</code>
                  <button type="button"
                    className={`${styles.copyBtn} ${upiCopied ? styles.copyBtnCopied : ''}`}
                    onClick={handleCopyUPI}>
                    {upiCopied ? '✓ Copied!' : '⎘ Copy'}
                  </button>
                </div>
                <p className={styles.upiHint}>Open PhonePe, GPay, or Paytm → Send money → paste UPI ID</p>
              </div>

              {/* Divider */}
              <div className={styles.payDivider}><span>or scan to pay</span></div>

              {/* QR */}
              <div className={styles.qrBlock}>
                <div className={styles.qrWrapper}>
                  <img src="/qr-code.jpeg" alt="UPI QR Code" className={styles.qrImage}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const sib = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                      if (sib) sib.style.display = 'flex';
                    }} />
                  <div className={styles.qrFallback}>
                    <span className={styles.qrFallbackIcon}>📱</span>
                    <span className={styles.qrFallbackText}>Add qr-code.png to /public</span>
                  </div>
                </div>
                <p className={styles.qrCaption}>Scan with any UPI app · ₹399</p>
              </div>
            </div>
          </section>

          {/* ── Submit ────────────────────────────────────── */}
          <div className={styles.submitArea}>
            <p className={styles.termsNote}>
              Submitting will open our{' '}
              <button type="button" className={styles.termsInlineBtn}
                onClick={() => { setTempAgreed(false); setShowTermsModal(true); }}>
                Terms &amp; Conditions
              </button>{' '}
              for your review before the final step.
            </p>

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading
                ? <><span className={styles.spinner} /> Processing…</>
                : <>Submit Application <span className={styles.submitArrow}>→</span></>}
            </button>

            {success && (
              <div className={styles.successBanner}>
                <span className={styles.successIcon}>🎉</span>
                <div>
                  <p className={styles.successTitle}>{success}</p>
                  <p className={styles.successSub}>Our team will contact you on WhatsApp shortly.</p>
                </div>
              </div>
            )}
          </div>

        </form>
      </main>
    </div>
  );
}