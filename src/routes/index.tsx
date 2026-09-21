import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Bluetooth,
  Check,
  CircleDot,
  ClipboardCheck,
  Cloud,
  Database,
  HeartPulse,
  LineChart,
  Radio,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  Target,
  Thermometer,
  Users,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OneCare Remote Patient Monitoring | Continuous Connected Care" },
      {
        name: "description",
        content:
          "OneCare RPM connects patients, devices, and doctors into one continuous care system with real-time monitoring and clinical workflows.",
      },
      { property: "og:title", content: "OneCare Remote Patient Monitoring" },
      {
        property: "og:description",
        content:
          "Connect patients, devices, and doctors in one continuous remote care system.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OneCareRpmPage,
});

type Device = {
  title: string;
  brand: string;
  description: string;
  measurement: string;
  type: "thermometer" | "bp" | "scale" | "oximeter" | "glucose" | "ecg" | "fetal";
};

const devices: Device[] = [
  { title: "FORA IR42 Thermometer", brand: "FORA", description: "The FORA IR42 Thermometer measures body temperature quickly and accurately using infrared technology. It displays temperature readings in °C (Celsius) or °F (Fahrenheit) for easy monitoring.", measurement: "°C / °F", type: "thermometer" },
  { title: "FORA TN’G BP", brand: "FORA", description: "Measures blood pressure and pulse rate quickly and displays the readings on the device screen.", measurement: "mmHg (Blood Pressure), bpm (Pulse Rate)", type: "bp" },
  { title: "FORA TN’G Scale 550", brand: "FORA", description: "Measures body weight and displays the reading clearly on the digital screen.", measurement: "kg / lb", type: "scale" },
  { title: "FORA TN’G SpO2", brand: "FORA", description: "Measures blood oxygen saturation and pulse rate quickly. Displays SpO₂ and pulse readings on the device screen.", measurement: "% (SpO₂), bpm (Pulse Rate)", type: "oximeter" },
  { title: "Fora 6 Connect", brand: "FORA", description: "Measures blood glucose levels quickly using a small blood sample. Displays the glucose reading clearly on the device screen.", measurement: "mg/dL (Blood Glucose), mmol/L", type: "glucose" },
  { title: "FORA D40g", brand: "FORA", description: "Measures blood pressure and pulse rate using an upper-arm cuff. Displays systolic, diastolic, and pulse readings on the device screen.", measurement: "mmHg (Blood Pressure), bpm (Pulse Rate)", type: "bp" },
  { title: "Test N’GO Advance Voice", brand: "TRANSTEK", description: "Measures blood pressure and pulse rate using an upper-arm cuff. Provides voice guidance and announces the readings for easy monitoring.", measurement: "mmHg (Blood Pressure), bpm (Pulse Rate)", type: "bp" },
  { title: "Vtrust Pulse Oximeter", brand: "TRANSTEK", description: "Measures blood oxygen level and pulse rate quickly. Displays SpO₂ and pulse readings on the device screen.", measurement: "% (SpO₂), bpm (Pulse Rate)", type: "oximeter" },
  { title: "TeleRPM BGM Gen 1", brand: "TRANSTEK", description: "Measures blood glucose levels using a small blood sample. Displays the glucose reading clearly on the device screen.", measurement: "mg/dL (Blood Glucose), mmol/L", type: "glucose" },
  { title: "TeleRPM BPM Gen 1", brand: "TRANSTEK", description: "Measures blood pressure and pulse rate using an arm cuff. Displays systolic, diastolic, and pulse readings clearly on the device screen.", measurement: "mmHg (Blood Pressure), bpm (Pulse Rate)", type: "bp" },
  { title: "Body Composition Monitor HBF-222T", brand: "OMRON", description: "Measures body weight and body composition using a digital scale. Displays weight and body composition readings on the device screen.", measurement: "kg / lb (Weight), % (Body Fat)", type: "scale" },
  { title: "Digital Weight Scale HN-300T2", brand: "OMRON", description: "Measures body weight quickly and accurately. Displays the weight reading clearly on the digital screen.", measurement: "kg / lb", type: "scale" },
  { title: "OMRON Automatic BP HEM-7361T", brand: "OMRON", description: "Measures blood pressure and pulse rate automatically using an upper-arm cuff. Displays systolic, diastolic, and pulse readings on the screen.", measurement: "mmHg (Blood Pressure), bpm (Pulse Rate)", type: "bp" },
  { title: "OMRON BPM HEM-7156T", brand: "OMRON", description: "Automatically measures blood pressure and pulse rate using an upper-arm cuff. Displays systolic, diastolic, and pulse readings clearly on the screen.", measurement: "mmHg (Blood Pressure), bpm (Pulse Rate)", type: "bp" },
  { title: "OMRON BPM HEM-7141T1", brand: "OMRON", description: "Measures blood pressure and pulse rate automatically using an upper-arm cuff. Displays systolic, diastolic, and pulse readings clearly on the screen.", measurement: "mmHg (Blood Pressure), bpm (Pulse Rate)", type: "bp" },
  { title: "OMRON BPM Hem7600T", brand: "OMRON", description: "Measures blood pressure and pulse rate using an upper-arm cuff. Displays systolic, diastolic, and pulse readings on the device screen.", measurement: "mmHg (Blood Pressure), bpm (Pulse Rate)", type: "bp" },
  { title: "OMRON Wrist BPM HEM-6232T", brand: "OMRON", description: "Measures blood pressure and pulse rate from the wrist. Displays systolic, diastolic, and pulse readings clearly on the screen.", measurement: "mmHg (Blood Pressure), bpm (Pulse Rate)", type: "bp" },
  { title: "OMRON HBF-255T", brand: "OMRON", description: "Measures body weight and body composition using a digital scale. Displays weight and body composition readings clearly on the device screen.", measurement: "kg / lb (Weight), % (Body Fat)", type: "scale" },
  { title: "PM10 Portable ECG Monitor", brand: "CONTEC", description: "Records and displays the heart’s electrical activity (ECG) and heart rate. Designed for quick and convenient cardiac monitoring.", measurement: "bpm (Heart Rate), mV (ECG)", type: "ecg" },
  { title: "CONTEC PM20 Portable ECG Monitor", brand: "CONTEC", description: "Records a 6-lead ECG and measures heart rate. Displays and stores ECG waveforms for convenient cardiac monitoring.", measurement: "bpm (Heart Rate), mV (ECG)", type: "ecg" },
  { title: "Luckcome EFM-50 Bluetooth Fetal Monitor", brand: "LUCKCOME", description: "Monitors fetal heart rate and uterine contractions during pregnancy. Supports Bluetooth connectivity for transmitting fetal monitoring data.", measurement: "bpm (Fetal Heart Rate), bpm (Maternal Heart Rate), % (TOCO)", type: "fetal" },
];

const challenges = [
  ["Post-discharge cardiac care", "Monitor BP, SpO2, ECG, and weight daily for patients discharged after MI, bypass, or angioplasty. Intervene before the next cardiac event."],
  ["Diabetic patient management", "Continuous glucose and HbA1c trend monitoring for high-risk diabetics across your entire patient population — without scheduling monthly OPD visits."],
  ["Post-surgical recovery tracking", "Track vitals, wound site temperature, and mobility for patients recovering at home after major surgery, reducing hospital stay duration by up to 2 days."],
  ["Chronic respiratory monitoring", "SpO2 and respiratory rate tracking for COPD and asthma patients helps prevent emergency admissions — the most expensive and avoidable cost in pulmonology."],
  ["High-risk pregnancy watch", "Remote foetal heart rate and maternal BP monitoring for high-risk pregnancies, especially critical for patients in tier-2 cities far from your facility."],
  ["ICU step-down & HDU overflow", "Move stable ICU patients to a remote monitoring ward earlier — freeing up critical beds while maintaining the same level of clinical oversight."],
];

const journey = [
  ["Patient Enrollment & Clinical Eligibility", "Select the patient, define the monitoring timeline, add diagnosis, and confirm clinical eligibility — ensuring only the right patients are enrolled for remote care."],
  ["Device Ordering & Consent", "Select device (glucose meter, BP monitor, etc.), define the vitals to track, and capture digital or manual patient consent."],
  ["Technical & Identity Verification", "Verify patient mobile compatibility (Android/iOS), check signal strength for uninterrupted data flow, and confirm patient identity — ensuring smooth, reliable monitoring from day one."],
  ["Device Provisioning & Activation", "Assign device from inventory, map it to the patient via mobile app, and complete handover. Patient is now connected."],
  ["Patient Onboarding & Monitoring Begins", "Patient logs into the OneCare app. Device sends readings via Bluetooth, data syncs instantly, and the clinical dashboard shows real-time vitals. A glucose reading of 430 mg/dL triggers a critical alert immediately."],
  ["Alerts, Intervention & Recovery", "Alerts are triggered automatically, patients receive care instructions instantly, and doctors intervene early."],
  ["Provider Visibility & Continuous Care", "Doctors see real-time dashboards, complete vitals history, and full alert tracking with timestamps — both patient and care team always aligned, without waiting for an OPD visit."],
];

const carePlans = [
  ["PLAN", "Personalised Care Plans", "Define treatment intent, monitoring duration, and care strategy for each patient individually."],
  ["GOALS", "SMART Goals", "Track measurable outcomes — glucose control, weight reduction, BP normalisation — with defined timelines."],
  ["TEAM", "Care Team Assignment", "Assign doctors, nurses, or dietitians per patient. Use predefined care templates to save setup time."],
  ["ALERTS", "Alert Thresholds", "Set patient-specific vitals limits with severity levels — from mild to critical — and define escalation paths."],
  ["ROUTINE", "Monitoring Routine", "Define how often each vital is recorded — morning fasting glucose, post-meal BP, or continuous SpO2."],
  ["DOCS", "Attachments & Education", "Upload reports, prescriptions, discharge summaries, and patient care plan — all in one care record."],
];

const useCases = [
  ["Chronic Disease Management", "Monitor diabetes, hypertension, and long-term cardiovascular conditions with daily vitals tracking and trend analytics — no monthly OPD visits needed."],
  ["Post-Discharge Monitoring", "Track recovery after surgery or hospitalisation. Reduce readmissions by identifying deterioration early — before it becomes an emergency."],
  ["Remote & Rural Care", "Monitor patients in tier-2 and tier-3 locations on 3G connections. Quality care no longer depends on proximity to your facility."],
  ["High-Risk Patient Watch", "Identify early signs of deterioration for post-cardiac, post-surgical, and high-risk pregnancy patients — and intervene before the crisis point."],
];

const reasons = [
  ["Fully Integrated Ecosystem", "RPM connects directly with OneCare RIS, HIS, and EMR — no middleware, no separate login, no duplicate records."],
  ["Real-Time Monitoring & Smart Alerts", "AI-driven risk scoring and threshold alerts — customised per patient to eliminate alert fatigue and surface only what matters."],
  ["Structured Clinical Workflows", "Enrollment, consent, care plans, alerts, and billing — every step is governed and auditable from a single clinical dashboard."],
  ["Device + Software + Care Plan in One", "From device provisioning to care plan management to billing — the entire RPM programme lives inside OneCare."],
  ["Secure AWS Infrastructure", "Encrypted data on AWS IoT Core + Timestream. Role-based access, full audit trail, and data never leaving Indian shores."],
];

const faqs = [
  ["What is RPM in healthcare?", "Remote Patient Monitoring (RPM) is a care delivery model that enables hospitals to track patients’ vital signs and health data in real time, outside the hospital setting. Using connected devices and digital platforms, clinicians can monitor patients remotely, detect early warning signs, and intervene before complications arise."],
  ["How does OneCare RPM work?", "OneCare RPM connects patients to your care team through medical-grade devices that capture vitals such as BP, SpO₂, ECG, glucose levels, and more. This data is transmitted securely to a centralized dashboard where clinicians can track trends, receive alerts for abnormal readings, and take timely action — all without requiring the patient to visit the hospital."],
  ["Who should implement RPM?", "RPM is ideal for hospitals and healthcare providers managing:\n\n• Chronic conditions (cardiac, diabetes, respiratory)\n• Post-discharge patients\n• High-risk populations (elderly, high-risk pregnancies)\n• ICU step-down or long-term care patients\n\nIt is particularly valuable for hospitals looking to scale care, optimize resources, and improve continuity of care."],
  ["Does RPM integrate with our existing HIS or EMR?", "Yes. OneCare RPM is designed to integrate seamlessly with existing Hospital Management Systems (HMS) and Electronic Medical Records (EMR). This ensures that patient data flows into your existing workflows without duplication, enabling a unified view of patient health and minimizing disruption to clinical operations."],
  ["Is the RPM platform secure?", "OneCare RPM is built on secure, industry-grade cloud infrastructure powered by AWS. The platform uses end-to-end encryption, role-based access controls, and secure data transmission protocols to ensure patient data is always protected."],
];

function SectionHeading({ eyebrow, title, copy, align = "left" }: { eyebrow?: string; title: string; copy?: string; align?: "left" | "center" }) {
  return <div className={cn("section-heading", align === "center" && "section-heading-center")}>
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    <h2>{title}</h2>
    {copy && <p className="section-copy">{copy}</p>}
  </div>;
}

function PrimaryActions({ final = false }: { final?: boolean }) {
  return <div className="flex flex-col gap-3 sm:flex-row">
    <Button size="lg" className="h-13 rounded-full px-7 text-[0.95rem] shadow-brand">
      {final ? "Book Free Demo" : "Book a Demo"}<ArrowRight />
    </Button>
    <Button size="lg" variant="outline" className="h-13 rounded-full border-foreground/15 bg-transparent px-7 text-[0.95rem]">
      {final ? "Speak with Expert" : "Talk to Our Experts"}
    </Button>
  </div>;
}

function MonitorVisual({ compact = false }: { compact?: boolean }) {
  return <div className={cn("monitor-visual", compact && "monitor-visual-compact")} aria-label="Patient vital signs flowing to the OneCare clinical team">
    <div className="signal-rings" />
    <div className="patient-node">
      <div className="node-icon"><HeartPulse /></div>
      <span>Patient</span>
    </div>
    <div className="device-node">
      <Activity />
      <span>Connected device</span>
      <strong>98<small>% SpO₂</small></strong>
    </div>
    <svg className="pulse-line" viewBox="0 0 620 260" aria-hidden="true">
      <path className="line-base" d="M12 155 C90 155 90 92 164 92 S246 210 322 132 S425 74 470 125 S548 160 610 80" />
      <path className="line-active" d="M12 155 C90 155 90 92 164 92 S246 210 322 132 S425 74 470 125 S548 160 610 80" />
    </svg>
    <div className="care-node"><Stethoscope /><span>Care team</span><small>Live oversight</small></div>
    <div className="live-chip"><span /> LIVE DATA</div>
  </div>;
}

function DeviceRender({ device }: { device: Device }) {
  const Icon = device.type === "thermometer" ? Thermometer : device.type === "ecg" || device.type === "fetal" ? Waves : device.type === "oximeter" ? HeartPulse : Activity;
  return <div className={cn("device-render", `device-${device.type}`)} aria-label={`${device.title} product placeholder`}>
    <div className="device-shadow" />
    <div className="device-body">
      <span className="device-brand">{device.brand}</span>
      <div className="device-screen"><Icon /><strong>{device.type === "scale" ? "68.4" : device.type === "glucose" ? "104" : device.type === "oximeter" ? "98" : device.type === "thermometer" ? "36.8" : "120"}</strong><small>{device.measurement.split(" ")[0]}</small></div>
      <span className="device-name">{device.title}</span>
      <CircleDot className="device-button" />
    </div>
  </div>;
}

function DeviceShowcase() {
  const [brand, setBrand] = useState("ALL DEVICES");
  const [index, setIndex] = useState(0);
  const touchStart = useRef<number | null>(null);
  const filtered = useMemo(() => brand === "ALL DEVICES" ? devices : devices.filter((device) => device.brand === brand), [brand]);
  const device = filtered[index] ?? filtered[0];
  const changeBrand = (nextBrand: string) => { setBrand(nextBrand); setIndex(0); };
  const previous = () => setIndex((current) => (current - 1 + filtered.length) % filtered.length);
  const next = () => setIndex((current) => (current + 1) % filtered.length);
  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(distance) > 45) distance > 0 ? previous() : next();
    touchStart.current = null;
  };
  if (!device) return null;
  return <div className="device-experience">
    <div className="device-filters" role="group" aria-label="Filter devices by manufacturer">
      {["ALL DEVICES", "FORA", "TRANSTEK", "OMRON", "CONTEC", "LUCKCOME"].map((item) => <Button key={item} variant="ghost" onClick={() => changeBrand(item)} className={cn("filter-button", brand === item && "filter-button-active")} aria-pressed={brand === item}>{item}</Button>)}
    </div>
    <div className="device-stage" onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={handleTouchEnd}>
      <div className="device-counter"><span>{String(index + 1).padStart(2, "0")}</span> / {String(filtered.length).padStart(2, "0")}</div>
      <div className="device-visual-wrap" key={`${brand}-${index}`}><DeviceRender device={device} /></div>
      <article className="device-details" key={device.title}>
        <p className="eyebrow">{device.brand}</p>
        <h3>{device.title}</h3>
        <p>{device.description}</p>
        <div className="measurement"><Activity /><div><span>MEASUREMENT</span><strong>{device.measurement}</strong></div></div>
        <div className="device-controls">
          <Button variant="outline" size="icon" className="control-button" onClick={previous} aria-label="Previous device"><ArrowLeft /></Button>
          <div className="progress-track"><span style={{ width: `${((index + 1) / filtered.length) * 100}%` }} /></div>
          <Button variant="default" size="icon" className="control-button" onClick={next} aria-label="Next device"><ArrowRight /></Button>
        </div>
      </article>
    </div>
  </div>;
}

function OneCareRpmPage() {
  return <main className="overflow-hidden bg-background text-foreground">
    <section className="hero-section">
      <div className="hero-grid page-shell">
        <div className="hero-copy reveal">
          <p className="eyebrow"><span className="status-dot" /> Remote Patient Monitoring</p>
          <h1>Your patients are at home.<br /><em>Your care continues without interruption.</em></h1>
          <p className="hero-description">OneCare RPM connects patients, devices, and doctors into one continuous care system — so you don’t wait for complications, you prevent them.</p>
          <PrimaryActions />
        </div>
        <MonitorVisual />
      </div>
      <div className="hero-stats page-shell">
        {[["4×", "more patients per consultant"], ["60 sec", "vitals refresh interval"], ["99.5%", "device data uptime on AWS"]].map(([value, label], i) => <div className="stat" key={label}><span>0{i + 1}</span><strong>{value}</strong><p>{label}</p></div>)}
      </div>
    </section>

    <section className="section challenge-section">
      <div className="page-shell">
        <SectionHeading eyebrow="THE CARE GAP" title="The challenge every hospital administrator goes through" copy="India has one doctor for every 834 patients. Beds are limited, OPDs are overloaded, and post-discharge follow-up falls through the cracks. OneCare RPM lets your hospital extend quality care beyond the ward — at scale, and without adding headcount." />
        <div className="story-path">
          {challenges.map(([title, copy], i) => <article className="story-item" key={title}>
            <div className="story-number">{String(i + 1).padStart(2, "0")}</div>
            <div><h3>{title}</h3><p>{copy}</p></div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="section device-section">
      <div className="page-shell">
        <SectionHeading eyebrow="CONNECTED HARDWARE" title="RPM Devices" copy="Explore the connected devices that bring patient vitals into one continuous care system." />
        <DeviceShowcase />
      </div>
    </section>

    <section className="section journey-section">
      <div className="page-shell">
        <SectionHeading eyebrow="ONE CONNECTED WORKFLOW" title="How it works" copy="Every step of the RPM journey is managed inside OneCare — from clinical eligibility to device activation to real-time monitoring and escalation." align="center" />
        <div className="journey-list">
          {journey.map(([title, copy], i) => <article className="journey-step" key={title}>
            <div className="journey-node"><span>{i + 1}</span></div>
            <div className="journey-content"><p>STEP {i + 1}</p><h3>{title}</h3><div>{copy}</div></div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="section care-plan-section">
      <div className="page-shell care-plan-grid">
        <div className="care-plan-intro">
          <SectionHeading eyebrow="MANAGED CARE" title="Every patient gets a structured care plan" copy="OneCare RPM is not just monitoring — it is managed care. Each enrolled patient receives a personalised plan built around their condition, goals, and clinical team." />
          <div className="care-orbit"><Target /><span>Patient</span><small>Personalised plan</small></div>
        </div>
        <div className="capability-list">
          {carePlans.map(([label, title, copy], i) => <article key={title} className="capability-row"><span>{String(i + 1).padStart(2, "0")}</span><div><p>{label}</p><h3>{title}</h3><div>{copy}</div></div></article>)}
        </div>
      </div>
    </section>

    <section className="section use-cases-section">
      <div className="page-shell">
        <SectionHeading eyebrow="FOCUSED OVERSIGHT" title="The conditions OneCare RPM manages best" copy="From chronic disease to post-surgical recovery, OneCare RPM extends quality care for the patients who need continuous oversight the most." />
        <div className="use-case-layout">
          <div className="case-signal"><HeartPulse /><span>Continuous</span><strong>care</strong></div>
          <div className="case-list">{useCases.map(([title, copy], i) => <article key={title}><span>{String(i + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
        </div>
      </div>
    </section>

    <section className="section ecosystem-section">
      <div className="page-shell">
        <SectionHeading eyebrow="DEVICE AGNOSTIC" title="Works with Devices Patients Already Use" copy="You prescribe based on clinical need and patient affordability." align="center" />
        <div className="ecosystem-flow">
          {[
            [Users, "Patient"], [Bluetooth, "Device"], [Radio, "Data"], [Cloud, "OneCare"], [Stethoscope, "Care Team"],
          ].map(([Icon, label], i) => {
            const FlowIcon = Icon as typeof Users;
            return <div className="ecosystem-step" key={label as string}><div><FlowIcon /></div><span>{label as string}</span>{i < 4 && <ArrowRight className="flow-arrow" />}</div>;
          })}
        </div>
        <div className="device-categories">{["BP monitors", "Glucometers", "Pulse oximeters & thermometers", "ECG devices", "Smart wearables", "Foetal dopplers and medical-grade devices"].map((item) => <span key={item}><Check />{item}</span>)}</div>
        <p className="ecosystem-statement">OneCare connects with all major medical device brands and protocols</p>
      </div>
    </section>

    <section className="section why-section">
      <div className="page-shell why-grid">
        <div className="why-intro"><SectionHeading eyebrow="WHY ONECARE RPM" title="Built different — not just another monitoring tool" copy="OneCare RPM is a fully integrated, end-to-end care system — not a standalone device dashboard bolted onto your existing HIS." /><div className="platform-mark"><Database /><div><span>ONECARE RPM</span><strong>One care system.<br />Every signal.</strong></div></div></div>
        <div className="reason-list">{reasons.map(([title, copy], i) => <article key={title}><span>FEATURE {String(i + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div>
    </section>

    <section className="section faq-section">
      <div className="page-shell faq-grid">
        <SectionHeading eyebrow="FAQ" title="Everything you need to know about OneCare RPM" />
        <Accordion type="single" collapsible className="faq-list">
          {faqs.map(([question, answer], i) => <AccordionItem value={`faq-${i}`} key={question} className="faq-item"><AccordionTrigger className="faq-trigger"><span>{String(i + 1).padStart(2, "0")}</span>{question}</AccordionTrigger><AccordionContent className="faq-answer"><p className="whitespace-pre-line">{answer}</p></AccordionContent></AccordionItem>)}
        </Accordion>
      </div>
    </section>

    <section className="final-cta-section">
      <div className="page-shell final-cta-grid">
        <div><p className="eyebrow">CONTINUOUS CARE STARTS HERE</p><h2>Extend your hospital beyond its walls</h2><p>Deliver continuous, connected care with OneCare RPM. Build a program tailored to your specialties, patient volumes, and revenue goals.</p><PrimaryActions final /></div>
        <MonitorVisual compact />
      </div>
    </section>
  </main>;
}
