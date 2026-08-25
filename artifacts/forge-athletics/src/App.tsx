import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  Dumbbell,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Play,
  Quote,
  X,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type Plan = 'open-gym' | 'training' | 'complete';
type ModalStage = 'form' | 'success';

const planDetails: Record<Plan, { name: string; price: string; eyebrow: string }> = {
  'open-gym': { name: 'Open Gym', price: '$59', eyebrow: 'For the self-directed' },
  training: { name: 'Training', price: '$149', eyebrow: 'For consistent progress' },
  complete: { name: 'Complete', price: '$219', eyebrow: 'For the full commitment' },
};

const navItems = [
  { label: 'Programs', target: 'programs' },
  { label: 'Coaching', target: 'coaching' },
  { label: 'Membership', target: 'membership' },
  { label: 'FAQ', target: 'faq' },
];

function scrollToId(target: string) {
  document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-3" aria-label="Forge Athletics home">
      <span className={`grid h-9 w-9 place-items-center ${light ? 'bg-[#ef592f] text-[#211914]' : 'bg-[#ef592f] text-[#211914]'}`}>
        <Dumbbell size={19} strokeWidth={2.5} aria-hidden="true" />
      </span>
      <span className={`font-display text-2xl font-bold uppercase leading-none tracking-tight ${light ? 'text-[#f7f0e5]' : 'text-[#211914]'}`}>
        Forge<span className="text-[#ef592f]">.</span>
      </span>
    </span>
  );
}

function Navbar({ onJoin }: { onJoin: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <a href="#top" data-testid="link-brand-home" aria-label="Forge Athletics home">
          <BrandMark light />
        </a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              href={`#${item.target}`}
              key={item.target}
              data-testid={`link-nav-${item.target}`}
              className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f7f0e5]/75 transition-colors hover:text-[#f7f0e5]"
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={onJoin}
            data-testid="button-nav-start"
            className="bg-[#ef592f] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#211914] transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#f4cf65] focus:ring-offset-2 focus:ring-offset-[#241b16]"
          >
            Start training
          </button>
        </nav>
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          data-testid="button-mobile-menu"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="grid h-11 w-11 place-items-center border border-[#f7f0e5]/35 text-[#f7f0e5] md:hidden"
        >
          {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>
      {mobileOpen && (
        <nav className="mx-4 border border-[#f7f0e5]/20 bg-[#241b16] p-3 shadow-2xl md:hidden" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <a
              href={`#${item.target}`}
              key={item.target}
              onClick={() => setMobileOpen(false)}
              data-testid={`link-mobile-nav-${item.target}`}
              className="flex items-center justify-between border-b border-[#f7f0e5]/10 px-4 py-4 text-xs font-bold uppercase tracking-[0.16em] text-[#f7f0e5]"
            >
              {item.label}
              <ArrowRight size={15} aria-hidden="true" />
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onJoin();
            }}
            data-testid="button-mobile-start"
            className="mt-3 flex w-full items-center justify-between bg-[#ef592f] px-4 py-4 text-xs font-bold uppercase tracking-[0.16em] text-[#211914]"
          >
            Start training <ArrowRight size={15} aria-hidden="true" />
          </button>
        </nav>
      )}
    </header>
  );
}

function Hero({ onJoin }: { onJoin: () => void }) {
  return (
    <section id="top" className="relative isolate min-h-[720px] overflow-hidden bg-[#241b16] text-[#f7f0e5] lg:min-h-[790px]">
      <img
        src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=2200"
        alt="Athlete pulling a heavy sled across a dark training floor"
        className="hero-image absolute inset-0 h-full w-full object-cover object-center opacity-55"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(29,21,17,.98)_0%,rgba(36,27,22,.82)_35%,rgba(36,27,22,.28)_72%,rgba(36,27,22,.55)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(36,27,22,.82)_0%,transparent_42%)]" />
      <div className="mx-auto flex min-h-[720px] max-w-7xl items-end px-5 pb-20 pt-36 sm:px-8 lg:min-h-[790px] lg:px-10 lg:pb-24">
        <div className="max-w-3xl">
          <div className="rise-in mb-7 flex items-center gap-3 text-[#f4cf65]">
            <span className="h-px w-10 bg-[#f4cf65]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.24em]">Brooklyn · Est. 2016</span>
          </div>
          <h1 data-testid="text-hero-heading" className="rise-in delay-1 max-w-4xl font-display text-[clamp(4.8rem,13vw,10.7rem)] font-bold uppercase leading-[.78] tracking-[-0.045em]">
            Stronger<br />
            <span className="text-[#ef592f]">by design.</span>
          </h1>
          <p data-testid="text-hero-description" className="rise-in delay-2 mt-9 max-w-md text-base leading-7 text-[#f7f0e5]/72 sm:text-lg">
            Structured training, smart coaching, and a room full of people who show up. Forge is where your next chapter gets built.
          </p>
          <div className="rise-in delay-3 mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onJoin}
              data-testid="button-hero-start"
              className="group inline-flex items-center gap-5 bg-[#ef592f] px-6 py-4 text-xs font-bold uppercase tracking-[0.17em] text-[#211914] transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#f4cf65] focus:ring-offset-2 focus:ring-offset-[#241b16]"
            >
              Book your intro
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollToId('story')}
              data-testid="button-hero-tour"
              className="group inline-flex items-center gap-3 px-2 py-4 text-xs font-bold uppercase tracking-[0.17em] text-[#f7f0e5]/80 transition-colors hover:text-[#f4cf65] focus:outline-none focus:ring-2 focus:ring-[#f4cf65]"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full border border-[#f7f0e5]/45 transition-colors group-hover:border-[#f4cf65]">
                <Play size={13} fill="currentColor" aria-hidden="true" />
              </span>
              See the room
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-7 right-5 hidden items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f7f0e5]/55 sm:flex lg:right-10">
        <span className="h-8 w-px bg-[#f7f0e5]/40" />
        Scroll to explore
      </div>
    </section>
  );
}

function ProofStrip() {
  return (
    <section aria-label="Forge member results" className="border-b border-[#d2c8ba] bg-[#f7f0e5]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-[#d2c8ba] sm:grid-cols-4">
        {[
          ['1,842', 'members coached'],
          ['6,410', 'personal bests logged'],
          ['4.9 / 5', 'member rating'],
          ['7:00–22:00', 'doors open daily'],
        ].map(([value, label], index) => (
          <div className={`px-5 py-7 ${index === 0 ? 'sm:pl-10' : ''} ${index === 3 ? 'sm:pr-10' : ''}`} key={label}>
            <p data-testid={`text-proof-value-${index}`} className="font-display text-3xl font-bold tracking-tight text-[#211914] sm:text-4xl">{value}</p>
            <p data-testid={`text-proof-label-${index}`} className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#75665b]">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function IntroSection() {
  return (
    <section id="story" className="forge-grid scroll-mt-8 bg-[#eadfce] px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
        <div>
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#ef592f]">01 / The Forge method</p>
          <h2 data-testid="text-story-heading" className="max-w-sm font-display text-6xl font-bold uppercase leading-[.86] tracking-tight text-[#211914] sm:text-7xl">
            No guesswork.<br /><span className="text-[#ef592f]">Just work.</span>
          </h2>
        </div>
        <div className="max-w-2xl pt-1">
          <p data-testid="text-story-lede" className="text-2xl font-medium leading-9 tracking-tight text-[#342820] sm:text-3xl sm:leading-10">
            You do not need more motivation. You need a plan that makes showing up feel like the obvious choice.
          </p>
          <div className="mt-10 grid gap-8 border-t border-[#c6b9a9] pt-8 sm:grid-cols-2">
            <div>
              <p className="font-display text-4xl font-bold text-[#ef592f]">01</p>
              <p className="mt-2 text-sm font-semibold text-[#342820]">Assess the starting point</p>
              <p className="mt-2 text-sm leading-6 text-[#75665b]">We learn how you move, what you want, and what has kept you stuck.</p>
            </div>
            <div>
              <p className="font-display text-4xl font-bold text-[#ef592f]">02</p>
              <p className="mt-2 text-sm font-semibold text-[#342820]">Build the next version</p>
              <p className="mt-2 text-sm leading-6 text-[#75665b]">A simple progression you can repeat, measure, and trust.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgramsSection({ onJoin }: { onJoin: () => void }) {
  const programs = [
    {
      number: 'A',
      title: 'Strength',
      text: 'The foundation. Learn the main lifts, build useful muscle, and leave feeling capable.',
      image: 'https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg?auto=compress&cs=tinysrgb&w=1200',
      alt: 'Barbell loaded for a strength training session',
      tag: 'Barbell · 60 min',
    },
    {
      number: 'B',
      title: 'Conditioning',
      text: 'Engine work with a purpose. Intervals, carries, and circuits that make everyday life easier.',
      image: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=1200',
      alt: 'Athlete training on an indoor rowing machine',
      tag: 'Mixed modal · 45 min',
    },
    {
      number: 'C',
      title: 'Athlete Lab',
      text: 'Move faster, react better, recover well. Built for field, court, and life outside the gym.',
      image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1200',
      alt: 'Athlete doing a dynamic jump in the training facility',
      tag: 'Performance · 75 min',
    },
  ];

  return (
    <section id="programs" className="scroll-mt-16 bg-[#f7f0e5] px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#ef592f]">02 / Train with intent</p>
            <h2 data-testid="text-programs-heading" className="font-display text-6xl font-bold uppercase leading-[.86] tracking-tight text-[#211914] sm:text-8xl">Pick your<br /><span className="text-[#ef592f]">line.</span></h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-[#75665b] md:pb-1">Different goals. Same standard. Every program is coach-led, measurable, and built to fit real life.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.12fr_.88fr_.88fr]">
          {programs.map((program, index) => (
            <article
              key={program.title}
              data-testid={`card-program-${program.title.toLowerCase().replace(' ', '-')}`}
              className={`group hover-lift relative min-h-[440px] overflow-hidden bg-[#342820] text-[#f7f0e5] ${index === 1 ? 'lg:mt-14' : ''} ${index === 2 ? 'lg:mt-28' : ''}`}
            >
              <img src={program.image} alt={program.alt} className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(33,25,20,.96)_4%,rgba(33,25,20,.18)_72%)]" />
              <div className="relative flex h-full min-h-[440px] flex-col justify-between p-6 sm:p-8">
                <div className="flex items-start justify-between">
                  <span className="grid h-10 w-10 place-items-center border border-[#f7f0e5]/55 font-display text-xl font-bold">{program.number}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#f4cf65]">{program.tag}</span>
                </div>
                <div>
                  <h3 className="font-display text-6xl font-bold uppercase leading-none">{program.title}</h3>
                  <p className="mt-4 max-w-sm text-sm leading-6 text-[#f7f0e5]/72">{program.text}</p>
                  <button
                    type="button"
                    onClick={onJoin}
                    data-testid={`button-program-${index}`}
                    className="mt-7 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.17em] text-[#f7f0e5] transition-colors hover:text-[#f4cf65] focus:outline-none focus:ring-2 focus:ring-[#f4cf65]"
                  >
                    Start with this <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoachingSection({ onJoin }: { onJoin: () => void }) {
  return (
    <section id="coaching" className="scroll-mt-16 bg-[#241b16] px-5 py-24 text-[#f7f0e5] sm:px-8 lg:px-10 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_.95fr] lg:gap-24">
        <div className="relative order-2 lg:order-1">
          <div className="absolute -left-3 -top-3 h-24 w-24 border-l border-t border-[#ef592f]" />
          <img
            src="https://images.pexels.com/photos/6456293/pexels-photo-6456293.jpeg?auto=compress&cs=tinysrgb&w=1500"
            alt="Forge coach guiding a member through a dumbbell movement"
            className="relative aspect-[4/5] w-full object-cover object-center grayscale-[20%]"
          />
          <div className="absolute -bottom-5 -right-3 bg-[#f4cf65] px-5 py-4 text-[#211914] sm:right-5">
            <p className="font-display text-3xl font-bold leading-none">1:8</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.13em]">coach to class ratio</p>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#f4cf65]">03 / Coaching that notices</p>
          <h2 data-testid="text-coaching-heading" className="max-w-xl font-display text-6xl font-bold uppercase leading-[.86] tracking-tight sm:text-8xl">Good form<br />changes <span className="text-[#ef592f]">everything.</span></h2>
          <p className="mt-8 max-w-lg text-base leading-7 text-[#f7f0e5]/68">Our coaches remember your name, your shoulder, and the set where you surprised yourself last week. You get eyes on your work — never shouted instructions from across the room.</p>
          <div className="mt-10 space-y-4 border-t border-[#f7f0e5]/15 pt-7">
            {['A plan that updates as you do', 'Technique cues you can actually use', 'Progress tracked beyond the mirror'].map((item) => (
              <div className="flex items-center gap-3 text-sm font-semibold" key={item}>
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#ef592f] text-[#211914]"><Check size={14} strokeWidth={3} aria-hidden="true" /></span>
                {item}
              </div>
            ))}
          </div>
          <button type="button" onClick={onJoin} data-testid="button-coaching-intro" className="mt-10 inline-flex items-center gap-3 border-b border-[#f4cf65] pb-2 text-xs font-bold uppercase tracking-[0.17em] text-[#f4cf65] transition-colors hover:text-[#f7f0e5] focus:outline-none focus:ring-2 focus:ring-[#f4cf65]">
            Meet your coach <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

function FacilitySection() {
  return (
    <section className="bg-[#d9ccba] px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[.65fr_1.35fr] lg:items-end">
          <div>
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#ef592f]">04 / The room</p>
            <h2 data-testid="text-facility-heading" className="font-display text-6xl font-bold uppercase leading-[.86] tracking-tight text-[#211914] sm:text-8xl">Come as<br /><span className="text-[#ef592f]">you are.</span></h2>
          </div>
          <p className="max-w-xl text-lg leading-8 text-[#4d3c31]">Raw materials. Warm light. The best equipment we could find. Forge is a training room designed to make hard things feel a little more possible — together.</p>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-[1.4fr_.8fr_.8fr] md:grid-rows-[210px_210px]">
          <img src="https://images.pexels.com/photos/1552253/pexels-photo-1552253.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="Wide view of Forge Athletics gym floor with racks and lifting platforms" className="h-full min-h-[300px] w-full object-cover md:row-span-2" />
          <img src="https://images.pexels.com/photos/4753890/pexels-photo-4753890.jpeg?auto=compress&cs=tinysrgb&w=1000" alt="Close view of hands gripping a barbell" className="h-full min-h-[210px] w-full object-cover" />
          <div className="flex min-h-[210px] flex-col justify-between bg-[#ef592f] p-6 text-[#211914]">
            <MapPin size={22} strokeWidth={1.7} aria-hidden="true" />
            <div>
              <p className="font-display text-3xl font-bold uppercase leading-none">Red Hook</p>
              <p className="mt-2 text-xs font-semibold leading-5">218 Van Brunt St.<br />Brooklyn, NY 11231</p>
            </div>
          </div>
          <div className="flex min-h-[210px] flex-col justify-between bg-[#342820] p-6 text-[#f7f0e5]">
            <Clock3 size={22} strokeWidth={1.7} className="text-[#f4cf65]" aria-hidden="true" />
            <div>
              <p className="font-display text-3xl font-bold uppercase leading-none">Always on</p>
              <p className="mt-2 text-xs font-semibold leading-5 text-[#f7f0e5]/65">Mon–Fri 6am–10pm<br />Sat–Sun 7am–8pm</p>
            </div>
          </div>
          <img src="https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=1000" alt="Two members training together with medicine balls" className="h-full min-h-[210px] w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

function MembershipSection({ selectedPlan, onSelect }: { selectedPlan: Plan; onSelect: (plan: Plan) => void }) {
  const plans: Array<{ id: Plan; name: string; price: string; description: string; features: string[]; featured?: boolean }> = [
    { id: 'open-gym', name: 'Open Gym', price: '$59', description: 'For athletes who already have the plan.', features: ['Full facility access', 'Personal training floor', 'Open gym orientation'] },
    { id: 'training', name: 'Training', price: '$149', description: 'The structure to make consistency stick.', features: ['3 coached sessions / week', 'Personalized progress plan', 'Monthly movement check-in'], featured: true },
    { id: 'complete', name: 'Complete', price: '$219', description: 'More support, more accountability, more you.', features: ['Unlimited coached sessions', 'Monthly 1:1 with a coach', 'Nutrition habits + recovery plan'] },
  ];

  return (
    <section id="membership" className="forge-grid scroll-mt-16 bg-[#eadfce] px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#ef592f]">05 / Choose your commitment</p>
            <h2 data-testid="text-membership-heading" className="font-display text-6xl font-bold uppercase leading-[.86] tracking-tight text-[#211914] sm:text-8xl">Make room<br /><span className="text-[#ef592f]">for better.</span></h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-[#75665b]">No initiation fee. Pause anytime with 30 days notice. Start with an intro session and make a smart decision.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <article key={plan.id} data-testid={`card-membership-${plan.id}`} className={`relative flex flex-col border p-7 transition-all duration-200 sm:p-8 ${plan.featured ? 'border-[#ef592f] bg-[#342820] text-[#f7f0e5] lg:-mt-5 lg:mb-5' : 'border-[#c6b9a9] bg-[#f7f0e5] text-[#211914]'} ${isSelected ? 'ring-2 ring-[#ef592f] ring-offset-2 ring-offset-[#eadfce]' : ''}`}>
                {plan.featured && <span className="absolute right-5 top-5 bg-[#f4cf65] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-[#211914]">Most chosen</span>}
                <p className={`text-[10px] font-bold uppercase tracking-[0.18em] ${plan.featured ? 'text-[#f4cf65]' : 'text-[#ef592f]'}`}>{plan.featured ? 'Best place to begin' : 'Membership'}</p>
                <h3 className="mt-8 font-display text-5xl font-bold uppercase leading-none">{plan.name}</h3>
                <p className={`mt-4 min-h-12 text-sm leading-6 ${plan.featured ? 'text-[#f7f0e5]/65' : 'text-[#75665b]'}`}>{plan.description}</p>
                <div className="mt-8 border-y border-current/15 py-5">
                  <span className="font-display text-5xl font-bold">{plan.price}</span><span className={`ml-2 text-xs ${plan.featured ? 'text-[#f7f0e5]/55' : 'text-[#75665b]'}`}>/ month</span>
                </div>
                <ul className="mt-7 flex-1 space-y-4">
                  {plan.features.map((feature) => <li className="flex items-start gap-3 text-sm" key={feature}><Check size={16} className={`mt-0.5 shrink-0 ${plan.featured ? 'text-[#f4cf65]' : 'text-[#ef592f]'}`} aria-hidden="true" />{feature}</li>)}
                </ul>
                <button type="button" onClick={() => onSelect(plan.id)} data-testid={`button-select-${plan.id}`} aria-pressed={isSelected} className={`mt-10 flex w-full items-center justify-between px-5 py-4 text-[11px] font-bold uppercase tracking-[0.16em] transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#ef592f] focus:ring-offset-2 ${plan.featured ? 'bg-[#ef592f] text-[#211914] focus:ring-offset-[#342820]' : 'bg-[#342820] text-[#f7f0e5]'}`}>
                  {isSelected ? 'Selected — start here' : 'Choose this plan'} <ArrowRight size={16} aria-hidden="true" />
                </button>
              </article>
            );
          })}
        </div>
        <p data-testid="text-membership-note" className="mt-7 text-center text-xs font-medium text-[#75665b]">All memberships include a 7-day “find your fit” window.</p>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    { quote: 'I stopped restarting. The plan is clear, the room is welcoming, and I can finally see the work adding up.', name: 'Maya R.', detail: 'Training member · 14 months', initials: 'MR' },
    { quote: 'Forge made strength feel like a skill I could learn, not a test I had to pass. My back feels better than it has in years.', name: 'Daniel K.', detail: 'Complete member · 2 years', initials: 'DK' },
    { quote: 'The coaches meet you where you are, then hold you to a higher standard. That balance is rare.', name: 'Priya S.', detail: 'Training member · 8 months', initials: 'PS' },
  ];

  return (
    <section className="bg-[#f7f0e5] px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 border-b border-[#d2c8ba] pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#ef592f]">06 / Member notes</p>
            <h2 data-testid="text-testimonials-heading" className="font-display text-6xl font-bold uppercase leading-[.86] tracking-tight text-[#211914] sm:text-8xl">The work<br /><span className="text-[#ef592f]">speaks.</span></h2>
          </div>
          <p className="text-sm font-semibold text-[#75665b]">Real people. Real consistency.</p>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <figure key={testimonial.name} data-testid={`card-testimonial-${index}`} className={`flex min-h-[300px] flex-col justify-between p-7 sm:p-8 ${index === 1 ? 'bg-[#f4cf65] text-[#211914]' : 'bg-[#eadfce] text-[#211914]'}`}>
              <Quote size={27} className={index === 1 ? 'text-[#ef592f]' : 'text-[#b65a3c]'} aria-hidden="true" />
              <blockquote className="mt-6 font-display text-3xl font-bold uppercase leading-[.95] tracking-tight">“{testimonial.quote}”</blockquote>
              <figcaption className="mt-9 flex items-center gap-3 border-t border-current/15 pt-5">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#342820] text-xs font-bold text-[#f7f0e5]" aria-hidden="true">{testimonial.initials}</span>
                <span><strong className="block text-sm">{testimonial.name}</strong><small className="text-xs opacity-60">{testimonial.detail}</small></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const questions = [
    ['I have never trained before. Is Forge for me?', 'Absolutely. Start with an intro session and we will meet you at your current level. You will learn the room, the basics, and what your first four weeks can look like — no performance required.'],
    ['What happens in the intro session?', 'You will spend 45 minutes with a coach talking through your goals, moving through a few simple patterns, and seeing the space. Wear whatever you can move comfortably in.'],
    ['Do I need to book classes in advance?', 'Our coached sessions are capped at 12 people, so booking ahead is the best way to save your spot. Open Gym members can drop in during all staffed hours.'],
    ['Can I pause or change my membership?', 'Yes. We ask for 30 days notice for changes, and our team will help you find the right fit if your schedule or goals shift.'],
    ['Where can I park?', 'There is free street parking around Van Brunt Street and a secure bike rack at the front door. We are a seven-minute walk from the Smith–9th Street station.'],
  ];
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="scroll-mt-16 bg-[#eadfce] px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.72fr_1.28fr] lg:gap-24">
        <div>
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#ef592f]">07 / The useful stuff</p>
          <h2 data-testid="text-faq-heading" className="font-display text-6xl font-bold uppercase leading-[.86] tracking-tight text-[#211914] sm:text-8xl">Good<br /><span className="text-[#ef592f]">questions.</span></h2>
          <p className="mt-8 max-w-xs text-sm leading-6 text-[#75665b]">Still curious? We like that. Ask us anything when you book your intro.</p>
        </div>
        <div className="border-t border-[#c6b9a9]">
          {questions.map(([question, answer], index) => {
            const isOpen = open === index;
            return (
              <div key={question} className="border-b border-[#c6b9a9]">
                <button type="button" onClick={() => setOpen(isOpen ? -1 : index)} data-testid={`button-faq-${index}`} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-6 py-6 text-left text-base font-semibold text-[#342820] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ef592f] sm:text-lg">
                  <span>{question}</span>
                  <span className="shrink-0 text-[#ef592f]">{isOpen ? <ChevronUp size={20} aria-hidden="true" /> : <ChevronDown size={20} aria-hidden="true" />}</span>
                </button>
                {isOpen && <p data-testid={`text-faq-answer-${index}`} className="max-w-2xl pb-7 pr-10 text-sm leading-7 text-[#75665b]">{answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ onJoin }: { onJoin: () => void }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#ef592f] px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
      <div className="absolute -right-16 -top-20 -z-10 h-80 w-80 rounded-full border-[1px] border-[#211914]/20 sm:h-[30rem] sm:w-[30rem]" />
      <div className="absolute -bottom-36 right-16 -z-10 h-96 w-96 rounded-full border-[1px] border-[#211914]/20" />
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-12 lg:flex-row lg:items-end">
        <div>
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#211914]/65">Your next set starts here</p>
          <h2 data-testid="text-final-heading" className="max-w-4xl font-display text-7xl font-bold uppercase leading-[.8] tracking-tight text-[#211914] sm:text-9xl">Ready to<br />put in work?</h2>
        </div>
        <div className="max-w-xs lg:pb-1">
          <p className="text-base leading-7 text-[#211914]/75">Book a low-pressure intro. See the room, meet a coach, and leave with a plan.</p>
          <button type="button" onClick={onJoin} data-testid="button-final-start" className="group mt-7 inline-flex items-center gap-4 bg-[#211914] px-6 py-4 text-xs font-bold uppercase tracking-[0.17em] text-[#f7f0e5] transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#f7f0e5] focus:ring-offset-2 focus:ring-offset-[#ef592f]">
            Claim your intro <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#241b16] px-5 py-12 text-[#f7f0e5] sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1fr_auto_auto_auto]">
        <div>
          <a href="#top" data-testid="link-footer-home"><BrandMark light /></a>
          <p className="mt-5 max-w-xs text-sm leading-6 text-[#f7f0e5]/55">Structured training for people building a stronger life, one session at a time.</p>
        </div>
        <div>
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f4cf65]">Explore</p>
          <div className="space-y-3 text-sm text-[#f7f0e5]/70">
            <a href="#programs" data-testid="link-footer-programs" className="block hover:text-[#f7f0e5]">Programs</a>
            <a href="#coaching" data-testid="link-footer-coaching" className="block hover:text-[#f7f0e5]">Coaching</a>
            <a href="#membership" data-testid="link-footer-membership" className="block hover:text-[#f7f0e5]">Membership</a>
          </div>
        </div>
        <div>
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f4cf65]">Visit</p>
          <p className="text-sm leading-6 text-[#f7f0e5]/70">218 Van Brunt St.<br />Brooklyn, NY 11231</p>
        </div>
        <div>
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f4cf65]">Say hello</p>
          <a href="mailto:hello@forgeathletics.co" data-testid="link-footer-email" className="flex items-center gap-2 text-sm text-[#f7f0e5]/70 hover:text-[#f7f0e5]"><Mail size={14} aria-hidden="true" /> hello@forgeathletics.co</a>
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer" data-testid="link-footer-instagram" className="mt-3 flex items-center gap-2 text-sm text-[#f7f0e5]/70 hover:text-[#f7f0e5]"><Instagram size={14} aria-hidden="true" /> @forgeathletics</a>
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-7xl flex-col justify-between gap-3 border-t border-[#f7f0e5]/15 pt-5 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#f7f0e5]/40 sm:flex-row">
        <span>© 2024 Forge Athletics</span>
        <span>Built for the long run.</span>
      </div>
    </footer>
  );
}

function SignupModal({ plan, onClose }: { plan: Plan; onClose: () => void }) {
  const [stage, setStage] = useState<ModalStage>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [goal, setGoal] = useState('');

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStage('success');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#211914]/75 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="signup-title" className="max-h-[92dvh] w-full max-w-lg overflow-y-auto bg-[#f7f0e5] p-6 text-[#211914] shadow-2xl sm:p-9">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ef592f]">{stage === 'form' ? 'Start at Forge' : 'You’re on the list'}</p>
            <h2 id="signup-title" data-testid="text-signup-heading" className="mt-3 font-display text-5xl font-bold uppercase leading-[.86]">{stage === 'form' ? 'Book your intro.' : 'Nice work.'}</h2>
          </div>
          <button type="button" onClick={onClose} data-testid="button-close-signup" aria-label="Close signup form" className="grid h-10 w-10 shrink-0 place-items-center border border-[#c6b9a9] text-[#342820] transition-colors hover:bg-[#eadfce] focus:outline-none focus:ring-2 focus:ring-[#ef592f]"><X size={18} aria-hidden="true" /></button>
        </div>
        {stage === 'form' ? (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="border border-[#c6b9a9] bg-[#eadfce] px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#75665b]">Your starting point</p>
              <p data-testid="text-signup-plan" className="mt-1 font-display text-2xl font-bold uppercase">{planDetails[plan].name} <span className="font-sans text-sm font-medium normal-case text-[#75665b]">{planDetails[plan].price} / month</span></p>
            </div>
            <label className="block text-xs font-bold uppercase tracking-[0.12em]">Your name
              <input required value={name} onChange={(event) => setName(event.target.value)} data-testid="input-signup-name" className="mt-2 block w-full border border-[#c6b9a9] bg-[#f7f0e5] px-4 py-3 text-sm font-medium normal-case tracking-normal outline-none transition-colors focus:border-[#ef592f] focus:ring-2 focus:ring-[#ef592f]/20" placeholder="First and last name" />
            </label>
            <label className="block text-xs font-bold uppercase tracking-[0.12em]">Email address
              <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} data-testid="input-signup-email" className="mt-2 block w-full border border-[#c6b9a9] bg-[#f7f0e5] px-4 py-3 text-sm font-medium normal-case tracking-normal outline-none transition-colors focus:border-[#ef592f] focus:ring-2 focus:ring-[#ef592f]/20" placeholder="you@email.com" />
            </label>
            <label className="block text-xs font-bold uppercase tracking-[0.12em]">What are you working toward?
              <textarea required value={goal} onChange={(event) => setGoal(event.target.value)} data-testid="input-signup-goal" rows={3} className="mt-2 block w-full resize-none border border-[#c6b9a9] bg-[#f7f0e5] px-4 py-3 text-sm font-medium normal-case tracking-normal outline-none transition-colors focus:border-[#ef592f] focus:ring-2 focus:ring-[#ef592f]/20" placeholder="More energy, your first pull-up, a stronger back..." />
            </label>
            <button type="submit" data-testid="button-submit-signup" className="group flex w-full items-center justify-between bg-[#ef592f] px-5 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[#211914] transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#ef592f] focus:ring-offset-2">Send my details <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden="true" /></button>
            <p className="text-center text-[11px] leading-5 text-[#75665b]">We’ll reply within one business day to find a time that works.</p>
          </form>
        ) : (
          <div className="mt-8">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-[#ef592f] text-[#211914]"><Check size={26} strokeWidth={3} aria-hidden="true" /></div>
            <p data-testid="text-signup-success" className="mt-6 text-base leading-7 text-[#4d3c31]">Thanks, {name.split(' ')[0] || 'friend'}. We have your note and will reach out at <strong>{email}</strong> with a few intro times.</p>
            <button type="button" onClick={onClose} data-testid="button-finish-signup" className="mt-8 border-b border-[#ef592f] pb-2 text-xs font-bold uppercase tracking-[0.17em] text-[#ef592f] focus:outline-none focus:ring-2 focus:ring-[#ef592f]">Back to Forge <ArrowRight size={15} className="ml-2 inline" aria-hidden="true" /></button>
          </div>
        )}
      </div>
    </div>
  );
}

function Home() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan>('training');

  useEffect(() => {
    document.title = 'Forge Athletics — Stronger by design';
    const description = 'Structured training, smart coaching, and a welcoming room in Brooklyn. Build a stronger life at Forge Athletics.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description);
    document.documentElement.lang = 'en';
  }, []);

  useEffect(() => {
    document.body.style.overflow = isSignupOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isSignupOpen]);

  const openSignup = (plan?: Plan) => {
    if (plan) setSelectedPlan(plan);
    setIsSignupOpen(true);
  };

  return (
    <div className="forge-noise min-h-[100dvh] bg-[#f7f0e5]">
      <Navbar onJoin={() => openSignup()} />
      <main>
        <Hero onJoin={() => openSignup()} />
        <ProofStrip />
        <IntroSection />
        <ProgramsSection onJoin={() => openSignup()} />
        <CoachingSection onJoin={() => openSignup()} />
        <FacilitySection />
        <MembershipSection selectedPlan={selectedPlan} onSelect={(plan) => openSignup(plan)} />
        <TestimonialsSection />
        <FAQSection />
        <FinalCTA onJoin={() => openSignup()} />
      </main>
      <Footer />
      {isSignupOpen && <SignupModal plan={selectedPlan} onClose={() => setIsSignupOpen(false)} />}
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;