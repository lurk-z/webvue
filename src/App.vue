<script setup>
import { computed, reactive, ref } from 'vue'

const partnerLogos = ['ODDO', 'HEXA', 'VORTEX', 'LUMI', 'CIRRUS', 'MOTION']

const audienceCards = [
  {
    title: 'Membership Organisations',
    text: 'Smart workflows for member onboarding, dues collection, and retention campaigns.',
  },
  {
    title: 'National Associations',
    text: 'A single operating layer for regional chapters, programs, and executive reporting.',
  },
  {
    title: 'Clubs And Groups',
    text: 'Simple tools for events, announcements, and community growth without extra admin.',
  },
]

const storyCards = [
  {
    category: 'Reframe',
    title: 'Creating streamlined safeguarding processes with one dashboard.',
  },
  {
    category: 'Revive',
    title: 'What a new volunteering experience unlocked for distributed teams.',
  },
  {
    category: 'Roadmap',
    title: 'Why modern membership platforms need connected data from day one.',
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

const isSubmitting = computed(() => submitState.value === 'submitting')

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
    submitMessage.value = `ส่งข้อมูลเรียบร้อยแล้ว หมายเลขอ้างอิง ${result.id}`
    form.name = ''
    form.email = ''
    form.organization = ''
    form.interest = 'Membership platform'
    form.message = ''
  } catch (error) {
    submitState.value = 'error'
    submitMessage.value = error.message || 'ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
  }
}
</script>

<template>
  <div class="page-shell">
    <header class="site-header">
      <a class="brand" href="#home" aria-label="Nexcent home">
        <span class="brand-mark">
          <span></span>
          <span></span>
        </span>
        Nexcent
      </a>

      <nav class="site-nav" aria-label="Primary">
        <a href="#home">Home</a>
        <a href="#features">Features</a>
        <a href="#community">Community</a>
        <a href="#stories">Blog</a>
        <a href="#contact">Pricing</a>
      </nav>

      <a class="button button-primary" href="#contact">Register Now</a>
    </header>

    <main>
      <section id="home" class="hero-section section-grid">
        <div class="hero-copy">
          <p class="eyebrow">Community management made durable</p>
          <h1>
            Lessons and insights
            <span>from 8 years</span>
          </h1>
          <p class="hero-text">
            One workspace for memberships, events, donations, reporting, and the day-to-day
            work that keeps a community moving.
          </p>
          <div class="hero-actions">
            <a class="button button-primary" href="#contact">Register</a>
            <a class="button button-secondary" href="#features">See how it works</a>
          </div>
          <div class="hero-dots" aria-hidden="true">
            <span class="is-active"></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div class="hero-visual" aria-hidden="true">
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
          <p>We have been working with some Fortune 500+ clients.</p>
        </div>

        <div class="logo-row">
          <span v-for="logo in partnerLogos" :key="logo">{{ logo }}</span>
        </div>
      </section>

      <section id="community" class="section audience-section">
        <div class="section-heading centered narrow">
          <p class="eyebrow">Who Nexcent works for</p>
          <h2>Manage your entire community in a single system</h2>
          <p>Purpose-built modules for organizations that need governance and speed at once.</p>
        </div>

        <div class="audience-grid">
          <article v-for="card in audienceCards" :key="card.title" class="info-card audience-card">
            <div class="card-icon">
              <span></span>
            </div>
            <h3>{{ card.title }}</h3>
            <p>{{ card.text }}</p>
          </article>
        </div>
      </section>

      <section id="features" class="section feature-section section-grid">
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
          <p class="eyebrow">Built for operations</p>
          <h2>The unseen of spending three years at Pixelgrade</h2>
          <p>
            Replace disconnected spreadsheets and manual approvals with one flow for payments,
            membership renewals, event registrations, and campaign updates.
          </p>
          <ul class="feature-list">
            <li>Reusable member records across every workflow.</li>
            <li>Real-time reporting for executives and local chapter leads.</li>
            <li>Automation rules that remove repetitive admin work.</li>
          </ul>
          <a class="button button-primary" href="#contact">Learn More</a>
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

      <section class="section testimonial-section section-grid">
        <div class="testimonial-media">
          <div class="testimonial-logo">T</div>
        </div>

        <div class="testimonial-copy">
          <p>
            “We redesigned how our chapters coordinate activities, and what used to take days of
            status chasing now happens in one shared workflow. The team finally has accurate
            numbers without exporting anything.”
          </p>
          <strong>Tim Smith</strong>
          <span>British Dragon Boat Racing Association</span>

          <div class="mini-logo-row">
            <span v-for="logo in partnerLogos.slice(0, 5)" :key="`${logo}-mini`">{{ logo }}</span>
          </div>
        </div>
      </section>

      <section id="stories" class="section stories-section">
        <div class="section-heading centered narrow">
          <p class="eyebrow">Customer stories</p>
          <h2>Caring is the new marketing</h2>
          <p>
            The next level of community growth comes from thoughtful operations and consistent
            member experiences.
          </p>
        </div>

        <div class="story-grid">
          <article v-for="story in storyCards" :key="story.title" class="story-card">
            <div class="story-image"></div>
            <div class="story-content">
              <span>{{ story.category }}</span>
              <h3>{{ story.title }}</h3>
              <a href="#contact">Read more</a>
            </div>
          </article>
        </div>
      </section>

      <section id="contact" class="section contact-section section-grid">
        <div class="contact-copy">
          <p class="eyebrow">Get started</p>
          <h2>Pellentesque suscipit fringilla libero eu.</h2>
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
            <textarea
              v-model.trim="form.message"
              name="message"
              rows="5"
              required
            ></textarea>
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
    </main>
  </div>
</template>
