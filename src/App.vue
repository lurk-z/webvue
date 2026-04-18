<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import heroImage from './assets/hero.png'

const routes = [
  { key: 'home', label: 'Home', path: '/' },
  { key: 'features', label: 'Features', path: '/features' },
  { key: 'community', label: 'Community', path: '/community' },
  { key: 'blog', label: 'Blog', path: '/blog' },
  { key: 'pricing', label: 'Pricing', path: '/pricing' },
]

const routeLookup = new Map(routes.map((route) => [route.path, route]))

function normalizePath(path) {
  if (!path || path === '/index.html') {
    return '/'
  }

  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
}

const currentPath = ref(normalizePath(window.location.pathname))

const pages = {
  home: {
    eyebrow: 'Community management made durable',
    title: 'Lessons and insights',
    accent: 'from 8 years',
    lead:
      'One workspace for memberships, events, donations, reporting, and the day-to-day work that keeps a community moving.',
  },
  features: {
    eyebrow: 'Features',
    title: 'Operational tools for the full member lifecycle.',
    lead:
      'Plan programs, collect payments, coordinate chapters, and report progress without splitting the work across disconnected systems.',
  },
  community: {
    eyebrow: 'Community',
    title: 'Programs built around the people who keep showing up.',
    lead:
      'Give members, volunteers, chapter leads, and executive teams the information they need without burying them in admin work.',
  },
  blog: {
    eyebrow: 'Blog',
    title: 'Practical notes from teams growing durable communities.',
    lead:
      'Read field-tested ideas on retention, operations, member communication, and the systems behind stronger associations.',
  },
  pricing: {
    eyebrow: 'Pricing',
    title: 'Choose the operating model that matches your community.',
    lead:
      'Start with the workflows you need now, then add automation, reporting, and implementation support as your programs grow.',
  },
}

const partnerLogos = ['ODDO', 'HEXA', 'VORTEX', 'LUMI', 'CIRRUS', 'MOTION']

const homeHighlights = [
  {
    title: 'Member records',
    text: 'Keep profiles, renewals, permissions, and engagement history in one reliable place.',
  },
  {
    title: 'Program operations',
    text: 'Run registrations, campaigns, events, and payments from a shared workflow.',
  },
  {
    title: 'Leadership reporting',
    text: 'Give teams accurate numbers without spreadsheet exports or manual status chasing.',
  },
]

const featureModules = [
  {
    title: 'Membership CRM',
    text: 'Track member status, segments, roles, renewals, and chapter relationships from one profile.',
  },
  {
    title: 'Events and Payments',
    text: 'Publish events, collect fees, manage attendance, and reconcile revenue without extra tools.',
  },
  {
    title: 'Campaign Automation',
    text: 'Trigger reminders, onboarding journeys, and donation follow-ups from live member activity.',
  },
  {
    title: 'Governance Reporting',
    text: 'Create board-ready dashboards for participation, finances, campaigns, and operational health.',
  },
  {
    title: 'Chapter Workspaces',
    text: 'Give local teams focused views while keeping data consistent across the whole network.',
  },
  {
    title: 'Access Controls',
    text: 'Set permissions for admins, staff, volunteers, and regional leaders without messy workarounds.',
  },
]

const featureChecklist = [
  'Reusable member records across every workflow.',
  'Real-time reporting for executives and local chapter leads.',
  'Automation rules that remove repetitive admin work.',
  'Secure role-based access for staff, volunteers, and partners.',
]

const communityPrograms = [
  {
    title: 'Membership Organisations',
    text: 'Structured onboarding, renewal journeys, dues collection, and retention programs.',
  },
  {
    title: 'National Associations',
    text: 'A shared operating layer for regional chapters, committees, governance, and reporting.',
  },
  {
    title: 'Clubs And Groups',
    text: 'Simple tools for events, announcements, member directories, and everyday coordination.',
  },
]

const communitySpotlights = [
  {
    title: 'Volunteer coordination',
    text: 'Assign roles, confirm availability, and keep every helper connected to the right updates.',
  },
  {
    title: 'Chapter enablement',
    text: 'Share templates, program data, and local targets without giving every team the same admin view.',
  },
  {
    title: 'Member engagement',
    text: 'Find slipping members early and send timely messages before renewal season becomes a rescue mission.',
  },
]

const blogPosts = [
  {
    category: 'Retention',
    title: 'How to spot renewal risk before the last reminder goes out',
    text: 'A practical checklist for turning participation data into member conversations that arrive on time.',
    readTime: '5 min read',
  },
  {
    category: 'Operations',
    title: 'What distributed chapters need from a shared dashboard',
    text: 'The reporting patterns that help local teams move quickly while leadership keeps trusted numbers.',
    readTime: '7 min read',
  },
  {
    category: 'Automation',
    title: 'Where automation helps communities, and where humans still matter',
    text: 'A grounded way to automate repetitive admin without sanding off the relationships members value.',
    readTime: '6 min read',
  },
]

const pricingPlans = [
  {
    name: 'Starter',
    price: '$49',
    description: 'For small teams moving member data out of spreadsheets.',
    features: ['Member directory', 'Basic event registration', 'Email support'],
  },
  {
    name: 'Growth',
    price: '$149',
    description: 'For growing communities coordinating programs and payments.',
    features: ['Automation journeys', 'Payments and invoices', 'Chapter reporting'],
    featured: true,
  },
  {
    name: 'Scale',
    price: 'Custom',
    description: 'For associations with complex governance and implementation needs.',
    features: ['Advanced permissions', 'Custom dashboards', 'Implementation support'],
  },
]

const stats = [
  { value: '2,245,341', label: 'Members' },
  { value: '46,328', label: 'Clubs' },
  { value: '828,867', label: 'Event bookings' },
  { value: '1,926,436', label: 'Payments processed' },
]

const form = reactive({
  name: '',
  email: '',
  organization: '',
  interest: 'Membership platform',
  message: '',
})

const submitState = ref('idle')
const submitMessage = ref('')

const activeRoute = computed(() => routeLookup.get(currentPath.value) ?? routes[0])
const currentPage = computed(() => pages[activeRoute.value.key])
const isSubmitting = computed(() => submitState.value === 'submitting')

function navigate(path) {
  const normalizedPath = normalizePath(path)

  if (!routeLookup.has(normalizedPath)) {
    return
  }

  if (currentPath.value !== normalizedPath) {
    window.history.pushState({}, '', normalizedPath)
    currentPath.value = normalizedPath
  }

  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}

function handleRouteClick(event, path) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
    return
  }

  event.preventDefault()
  navigate(path)
}

function handlePopState() {
  currentPath.value = normalizePath(window.location.pathname)
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}

onMounted(() => {
  if (!routeLookup.has(currentPath.value)) {
    window.history.replaceState({}, '', '/')
    currentPath.value = '/'
  }

  window.addEventListener('popstate', handlePopState)
})

onBeforeUnmount(() => {
  window.removeEventListener('popstate', handlePopState)
})

async function handleSubmit() {
  submitState.value = 'submitting'
  submitMessage.value = ''

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Unable to submit the form.')
    }

    submitState.value = 'success'
    submitMessage.value = `Submission saved. Reference ${result.id}.`
    form.name = ''
    form.email = ''
    form.organization = ''
    form.interest = 'Membership platform'
    form.message = ''
  } catch (error) {
    submitState.value = 'error'
    submitMessage.value =
      error.message || 'The form could not be submitted. Please try again.'
  }
}
</script>

<template>
  <div class="page-shell">
    <header class="site-header">
      <a class="brand" href="/" aria-label="Nexcent home" @click="handleRouteClick($event, '/')">
        <span class="brand-mark">
          <span></span>
          <span></span>
        </span>
        Nexcent
      </a>

      <nav class="site-nav" aria-label="Primary">
        <a
          v-for="route in routes"
          :key="route.key"
          :href="route.path"
          :class="{ 'is-active': activeRoute.key === route.key }"
          :aria-current="activeRoute.key === route.key ? 'page' : undefined"
          @click="handleRouteClick($event, route.path)"
        >
          {{ route.label }}
        </a>
      </nav>

      <a class="button button-primary" href="/pricing" @click="handleRouteClick($event, '/pricing')">
        Register Now
      </a>
    </header>

    <main class="route-view" :key="activeRoute.key">
      <template v-if="activeRoute.key === 'home'">
        <section class="hero-section section-grid">
          <div class="hero-copy">
            <p class="eyebrow">{{ currentPage.eyebrow }}</p>
            <h1>
              {{ currentPage.title }}
              <span>{{ currentPage.accent }}</span>
            </h1>
            <p class="hero-text">{{ currentPage.lead }}</p>
            <div class="hero-actions">
              <a
                class="button button-primary"
                href="/pricing"
                @click="handleRouteClick($event, '/pricing')"
              >
                Register
              </a>
              <a
                class="button button-secondary"
                href="/features"
                @click="handleRouteClick($event, '/features')"
              >
                See how it works
              </a>
            </div>
            <div class="hero-dots" aria-hidden="true">
              <span class="is-active"></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div class="hero-visual" aria-hidden="true">
            <img class="hero-image" :src="heroImage" alt="" />

            <div class="dashboard-card dashboard-main">
              <div class="dashboard-header">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div class="dashboard-layout">
                <div class="dashboard-sidebar">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div class="dashboard-content">
                  <div class="dashboard-panel panel-wide"></div>
                  <div class="dashboard-row">
                    <div class="dashboard-panel"></div>
                    <div class="dashboard-panel"></div>
                  </div>
                  <div class="dashboard-row chart-row">
                    <div class="chart-bars">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div class="activity-list">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="dashboard-card dashboard-floating">
              <p>Live campaign health</p>
              <strong>94% completion</strong>
              <div class="mini-chart">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

            <div class="person-card">
              <div class="person-avatar"></div>
              <div>
                <strong>Operations lead</strong>
                <p>Approving community updates</p>
              </div>
            </div>
          </div>
        </section>

        <section class="section clients-section">
          <div class="section-heading centered">
            <p class="eyebrow">Trusted by growing teams</p>
            <h2>Our Clients</h2>
            <p>We have been working with organizations that need reliable community operations.</p>
          </div>

          <div class="logo-row">
            <span v-for="logo in partnerLogos" :key="logo">{{ logo }}</span>
          </div>
        </section>

        <section class="section audience-section">
          <div class="section-heading centered narrow">
            <p class="eyebrow">Platform overview</p>
            <h2>Everything your main dashboard should answer first.</h2>
            <p>
              Give leaders the first answers they need, then let each team move into the workflow
              that matters to their role.
            </p>
          </div>

          <div class="audience-grid">
            <article
              v-for="card in homeHighlights"
              :key="card.title"
              class="info-card audience-card"
            >
              <div class="card-icon">
                <span></span>
              </div>
              <h3>{{ card.title }}</h3>
              <p>{{ card.text }}</p>
            </article>
          </div>
        </section>

        <section class="section stats-section">
          <div>
            <p class="eyebrow">Network momentum</p>
            <h2>Helping a local business reinvent itself</h2>
            <p>We reached here with our hard work and dedication.</p>
          </div>

          <div class="stats-grid">
            <article v-for="stat in stats" :key="stat.label" class="stat-card">
              <strong>{{ stat.value }}</strong>
              <span>{{ stat.label }}</span>
            </article>
          </div>
        </section>
      </template>

      <template v-else-if="activeRoute.key === 'features'">
        <section class="section subpage-hero">
          <p class="eyebrow">{{ currentPage.eyebrow }}</p>
          <h1>{{ currentPage.title }}</h1>
          <p class="page-lead">{{ currentPage.lead }}</p>
        </section>

        <section class="section feature-panel-grid">
          <article v-for="module in featureModules" :key="module.title" class="info-card detail-card">
            <div class="card-icon">
              <span></span>
            </div>
            <h2>{{ module.title }}</h2>
            <p>{{ module.text }}</p>
          </article>
        </section>

        <section class="section feature-section section-grid">
          <div class="feature-illustration" aria-hidden="true">
            <div class="illustration-window">
              <div class="illustration-sidebar"></div>
              <div class="illustration-main">
                <div class="illustration-card large"></div>
                <div class="illustration-card small"></div>
                <div class="illustration-card small"></div>
              </div>
            </div>
          </div>

          <div class="feature-copy">
            <p class="eyebrow">Workflow depth</p>
            <h2>Every feature page detail is its own content now.</h2>
            <p>
              Match each stage of the member journey with a focused workflow, from first signup to
              renewal, reporting, and long-term engagement.
            </p>
            <ul class="feature-list">
              <li v-for="item in featureChecklist" :key="item">{{ item }}</li>
            </ul>
            <a
              class="button button-primary"
              href="/pricing"
              @click="handleRouteClick($event, '/pricing')"
            >
              Compare plans
            </a>
          </div>
        </section>
      </template>

      <template v-else-if="activeRoute.key === 'community'">
        <section class="section subpage-hero">
          <p class="eyebrow">{{ currentPage.eyebrow }}</p>
          <h1>{{ currentPage.title }}</h1>
          <p class="page-lead">{{ currentPage.lead }}</p>
        </section>

        <section class="section audience-section">
          <div class="section-heading centered narrow">
            <p class="eyebrow">Who Nexcent works for</p>
            <h2>Different communities, different operating needs.</h2>
            <p>
              Support each group with focused workflows while keeping the shared community record
              accurate and current.
            </p>
          </div>

          <div class="audience-grid">
            <article
              v-for="program in communityPrograms"
              :key="program.title"
              class="info-card audience-card"
            >
              <div class="card-icon">
                <span></span>
              </div>
              <h3>{{ program.title }}</h3>
              <p>{{ program.text }}</p>
            </article>
          </div>
        </section>

        <section class="section process-section">
          <div class="section-heading narrow">
            <p class="eyebrow">Community playbooks</p>
            <h2>Give each team a clearer way to contribute.</h2>
          </div>

          <div class="process-list">
            <article
              v-for="spotlight in communitySpotlights"
              :key="spotlight.title"
              class="info-card process-card"
            >
              <h3>{{ spotlight.title }}</h3>
              <p>{{ spotlight.text }}</p>
            </article>
          </div>
        </section>
      </template>

      <template v-else-if="activeRoute.key === 'blog'">
        <section class="section subpage-hero">
          <p class="eyebrow">{{ currentPage.eyebrow }}</p>
          <h1>{{ currentPage.title }}</h1>
          <p class="page-lead">{{ currentPage.lead }}</p>
        </section>

        <section class="section stories-section">
          <div class="story-grid">
            <article v-for="post in blogPosts" :key="post.title" class="story-card blog-card">
              <div class="story-image"></div>
              <div class="story-content">
                <div class="blog-meta">
                  <span>{{ post.category }}</span>
                  <small>{{ post.readTime }}</small>
                </div>
                <h2>{{ post.title }}</h2>
                <p>{{ post.text }}</p>
                <a href="/pricing" @click="handleRouteClick($event, '/pricing')">Talk to us</a>
              </div>
            </article>
          </div>
        </section>
      </template>

      <template v-else-if="activeRoute.key === 'pricing'">
        <section class="section subpage-hero">
          <p class="eyebrow">{{ currentPage.eyebrow }}</p>
          <h1>{{ currentPage.title }}</h1>
          <p class="page-lead">{{ currentPage.lead }}</p>
        </section>

        <section class="section plan-grid">
          <article
            v-for="plan in pricingPlans"
            :key="plan.name"
            class="info-card plan-card"
            :class="{ 'is-featured': plan.featured }"
          >
            <span v-if="plan.featured" class="plan-badge">Most popular</span>
            <h2>{{ plan.name }}</h2>
            <strong class="plan-price">{{ plan.price }}</strong>
            <p>{{ plan.description }}</p>
            <ul class="plan-feature-list">
              <li v-for="feature in plan.features" :key="feature">{{ feature }}</li>
            </ul>
          </article>
        </section>

        <section class="section contact-section section-grid">
          <div class="contact-copy">
            <p class="eyebrow">Get started</p>
            <h2>Tell us what your community needs next.</h2>
            <p>
              Send your project details and the form will be submitted to the local API in this
              project. Every successful submission is stored on disk for review.
            </p>
            <div class="contact-note">
              <strong>Stored locally</strong>
              <span>Submissions are saved to server/data/submissions.json</span>
            </div>
          </div>

          <form class="contact-form" @submit.prevent="handleSubmit">
            <label>
              Full name
              <input v-model.trim="form.name" type="text" name="name" required />
            </label>

            <label>
              Email address
              <input v-model.trim="form.email" type="email" name="email" required />
            </label>

            <label>
              Organization
              <input v-model.trim="form.organization" type="text" name="organization" required />
            </label>

            <label>
              Interested in
              <select v-model="form.interest" name="interest">
                <option>Membership platform</option>
                <option>Association CRM</option>
                <option>Events and payments</option>
                <option>Custom implementation</option>
              </select>
            </label>

            <label class="form-full">
              Project details
              <textarea v-model.trim="form.message" name="message" rows="5" required></textarea>
            </label>

            <div class="form-actions form-full">
              <button class="button button-primary" type="submit" :disabled="isSubmitting">
                {{ isSubmitting ? 'Submitting...' : 'Submit enquiry' }}
              </button>
              <p class="form-status" :class="submitState" aria-live="polite">
                {{ submitMessage }}
              </p>
            </div>
          </form>
        </section>
      </template>
    </main>
  </div>
</template>
