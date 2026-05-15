<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import heroImage from './assets/hero.png'

const routes = [
  { key: 'home', label: 'Home', path: '/' },
  { key: 'menu', label: 'Menu', path: '/menu' },
  { key: 'reservation', label: 'Reservation', path: '/reservation' },
  { key: 'order', label: 'Order', path: '/order' },
  { key: 'promotions', label: 'Promotions', path: '/promotions' },
  { key: 'about', label: 'About', path: '/about' },
  { key: 'contact', label: 'Contact', path: '/contact' },
]

const routeLookup = new Map(routes.map((route) => [route.path, route]))

function normalizePath(path) {
  if (!path || path === '/index.html') return '/'
  if (path === '/reservation/success' || path === '/order/success' || path === '/contact/success') {
    return path
  }
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
}

const currentPath = ref(normalizePath(window.location.pathname))

const currentRoute = computed(() => {
  if (currentPath.value.endsWith('/success')) {
    return { key: 'success', label: 'Success', path: currentPath.value }
  }

  return routeLookup.get(currentPath.value) ?? routes[0]
})

const featuredDishes = [
  {
    name: 'Charred River Prawn',
    tag: 'Signature',
    price: '$28',
    description: 'Grilled prawn, lime butter, roasted chili jam, and crisp herbs.',
  },
  {
    name: 'Green Curry Gnocchi',
    tag: 'Chef pick',
    price: '$21',
    description: 'Handmade potato gnocchi folded through basil curry and coconut cream.',
  },
  {
    name: 'Smoked Duck Larb',
    tag: 'Spicy',
    price: '$24',
    description: 'Smoked duck, toasted rice, mint, shallot, and tamarind dressing.',
  },
]

const menuSections = [
  {
    title: 'Small Plates',
    items: [
      ['Crispy Mushroom Toast', '$12', 'Fermented garlic, herbs, and chili oil.'],
      ['Pomelo Salad Cups', '$14', 'Coconut, peanut, shallot, and lime leaf.'],
      ['Chicken Satay Skewers', '$15', 'Peanut relish and cucumber pickle.'],
    ],
  },
  {
    title: 'Mains',
    items: [
      ['Short Rib Massaman', '$31', 'Slow braised beef, potato, cashew, and roti.'],
      ['Seared Sea Bass', '$29', 'Lemongrass broth, greens, and jasmine rice.'],
      ['Roasted Pumpkin Khao Soi', '$22', 'Egg noodles, pickled mustard greens, and chili crisp.'],
    ],
  },
  {
    title: 'Desserts',
    items: [
      ['Mango Sticky Rice Sundae', '$11', 'Coconut caramel and toasted mung bean.'],
      ['Thai Tea Creme Brulee', '$10', 'Burnt sugar and orange zest.'],
      ['Coconut Sorbet', '$8', 'Pineapple, basil seed, and lime.'],
    ],
  },
]

const testimonials = [
  'The kind of place where the first bite changes dinner plans into a weekly ritual.',
  'Beautiful room, tight service, and a menu that makes every table order too much.',
  'Great for dates, client meals, and friends who care about sauce as much as atmosphere.',
]

const faqs = [
  ['Do you accept walk-ins?', 'Yes. We keep a few counter seats open every night, but reservations are recommended.'],
  ['Can you handle allergies?', 'Tell us during booking and our kitchen will guide you toward safe dishes.'],
  ['Is takeaway available?', 'Pickup orders are available from 11:30 to 21:30 through the order page.'],
  ['Do you host private events?', 'Yes. The dining room and terrace can be booked for groups of 12 to 70 guests.'],
]

const reservationForm = reactive({
  formType: 'reservation',
  name: '',
  email: '',
  phone: '',
  date: '',
  time: '19:00',
  guests: '2',
  occasion: 'Dinner',
  seating: 'Dining room',
  message: '',
  updates: true,
})

const orderForm = reactive({
  formType: 'order',
  name: '',
  email: '',
  phone: '',
  pickupTime: '18:30',
  entree: 'Charred River Prawn',
  quantity: 1,
  spice: 'Medium',
  extras: [],
  message: '',
})

const contactForm = reactive({
  formType: 'contact',
  name: '',
  email: '',
  topic: 'Private dining',
  message: '',
})

const cateringForm = reactive({
  formType: 'catering',
  name: '',
  email: '',
  phone: '',
  date: '',
  guests: '20',
  occasion: 'Office lunch',
  message: '',
})

const feedbackForm = reactive({
  formType: 'feedback',
  name: '',
  email: '',
  topic: 'Dining experience',
  message: '',
})

const newsletterForm = reactive({
  formType: 'newsletter',
  name: 'Guest',
  email: '',
  message: 'Newsletter signup from landing page.',
})

const submitState = reactive({
  reservation: 'idle',
  order: 'idle',
  contact: 'idle',
  catering: 'idle',
  feedback: 'idle',
  newsletter: 'idle',
})

const submitMessage = reactive({
  reservation: '',
  order: '',
  contact: '',
  catering: '',
  feedback: '',
  newsletter: '',
})

function navigate(path) {
  const normalizedPath = normalizePath(path)

  if (!routeLookup.has(normalizedPath) && !normalizedPath.endsWith('/success')) return

  if (currentPath.value !== normalizedPath) {
    window.history.pushState({}, '', normalizedPath)
    currentPath.value = normalizedPath
  }

  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}

function handleRouteClick(event, path) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
  event.preventDefault()
  navigate(path)
}

function handlePopState() {
  currentPath.value = normalizePath(window.location.pathname)
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}

async function submitForm(type, form, successPath) {
  submitState[type] = 'submitting'
  submitMessage[type] = ''

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const result = await response.json()

    if (!response.ok) throw new Error(result.message || 'Unable to submit the form.')

    submitState[type] = 'success'
    submitMessage[type] = `Saved. Reference ${result.id}.`

    if (successPath) navigate(successPath)
  } catch (error) {
    submitState[type] = 'error'
    submitMessage[type] = error.message || 'The form could not be submitted.'
  }
}

function deadClickLabel(event) {
  event.currentTarget.dataset.testClicks = String(Number(event.currentTarget.dataset.testClicks || 0) + 1)
}

onMounted(() => {
  if (!routeLookup.has(currentPath.value) && !currentPath.value.endsWith('/success')) {
    window.history.replaceState({}, '', '/')
    currentPath.value = '/'
  }

  window.addEventListener('popstate', handlePopState)
})

onBeforeUnmount(() => {
  window.removeEventListener('popstate', handlePopState)
})
</script>

<template>
  <div class="site-shell" data-test-site="restaurant-ux-lab">
    <header class="site-header" data-snapshot-region="header">
      <a class="brand" href="/" aria-label="Saffron Table home" @click="handleRouteClick($event, '/')">
        <span class="brand-mark">ST</span>
        <span>Saffron Table</span>
      </a>

      <nav class="site-nav" aria-label="Primary navigation">
        <a
          v-for="route in routes"
          :key="route.key"
          :href="route.path"
          :class="{ 'is-active': currentRoute.key === route.key }"
          :aria-current="currentRoute.key === route.key ? 'page' : undefined"
          @click="handleRouteClick($event, route.path)"
        >
          {{ route.label }}
        </a>
      </nav>

      <a class="button button-primary" href="/reservation" @click="handleRouteClick($event, '/reservation')">
        Book a table
      </a>
    </header>

    <main :key="currentPath" class="route-view" data-snapshot-region="main">
      <template v-if="currentRoute.key === 'home'">
        <section class="hero-section section-grid" data-analytics-section="hero">
          <div class="hero-copy">
            <p class="eyebrow">Modern Thai dining house</p>
            <h1>Bright fire, slow sauces, and tables worth lingering over.</h1>
            <p>
              Saffron Table is a neighborhood restaurant built for real meals: weekday lunches,
              celebratory dinners, pickup orders, private dining, and the kind of dessert people
              pretend they will share.
            </p>
            <div class="hero-actions">
              <a class="button button-primary" href="/menu" @click="handleRouteClick($event, '/menu')">Explore menu</a>
              <a class="button button-secondary" href="/order" @click="handleRouteClick($event, '/order')">Order pickup</a>
            </div>
          </div>

          <div class="hero-visual" aria-label="Restaurant feature visual">
            <img :src="heroImage" alt="Illustrated restaurant service scene" />
            <div class="visual-card">
              <span>Tonight</span>
              <strong>34 tables booked</strong>
              <p>Peak interest around 19:00-20:30</p>
            </div>
          </div>
        </section>

        <section class="section promo-band" data-analytics-section="promo-strip">
          <button class="promo-pill dead-click-target" type="button" @click="deadClickLabel">Limited seat badge</button>
          <button class="promo-pill dead-click-target" type="button" @click="deadClickLabel">Chef note badge</button>
          <button class="promo-pill dead-click-target" type="button" @click="deadClickLabel">Terrace badge</button>
        </section>

        <section class="section section-grid story-section" data-analytics-section="story">
          <div>
            <p class="eyebrow">Our kitchen</p>
            <h2>Built for heat, balance, and clean data trails.</h2>
            <p>
              This long landing page intentionally includes many sections, buttons, cards, text
              blocks, form fields, and deep scroll areas so analytics tools can test page depth,
              attention, click density, form behavior, conversion paths, and session replay.
            </p>
          </div>
          <div class="metric-grid">
            <article><strong>86</strong><span>Seats</span></article>
            <article><strong>7</strong><span>Dining zones</span></article>
            <article><strong>24</strong><span>Menu items</span></article>
            <article><strong>4</strong><span>Daily services</span></article>
          </div>
        </section>

        <section class="section" data-analytics-section="featured-dishes">
          <div class="section-heading">
            <p class="eyebrow">Featured dishes</p>
            <h2>Menu cards with clear click targets and readable DOM content.</h2>
          </div>
          <div class="card-grid">
            <article v-for="dish in featuredDishes" :key="dish.name" class="dish-card">
              <span>{{ dish.tag }}</span>
              <h3>{{ dish.name }}</h3>
              <p>{{ dish.description }}</p>
              <div>
                <strong>{{ dish.price }}</strong>
                <a href="/order" @click="handleRouteClick($event, '/order')">Add to order</a>
              </div>
            </article>
          </div>
        </section>

        <section class="section section-grid booking-preview" data-analytics-section="reservation-preview">
          <div>
            <p class="eyebrow">Reservation funnel</p>
            <h2>Home to reservation to success is a clean conversion path.</h2>
            <p>
              Use this flow to test funnel analysis: visit the home page, open the reservation
              page, focus fields, submit, then land on a success URL.
            </p>
            <a class="button button-primary" href="/reservation" @click="handleRouteClick($event, '/reservation')">
              Start reservation
            </a>
          </div>
          <ol class="steps-list">
            <li>Choose date, time, party size, and seating zone.</li>
            <li>Trigger field focus, change, checkbox, and textarea events.</li>
            <li>Submit through the local API and land on a success page.</li>
          </ol>
        </section>

        <section class="section" data-analytics-section="reviews">
          <div class="section-heading">
            <p class="eyebrow">Guest notes</p>
            <h2>Review blocks create mid-page reading and scroll behavior.</h2>
          </div>
          <div class="quote-grid">
            <blockquote v-for="quote in testimonials" :key="quote">{{ quote }}</blockquote>
          </div>
        </section>

        <section class="section newsletter-section" data-analytics-section="newsletter">
          <div>
            <p class="eyebrow">Newsletter test form</p>
            <h2>Short form for signup analytics.</h2>
          </div>
          <form class="inline-form" @submit.prevent="submitForm('newsletter', newsletterForm)">
            <label>
              Email
              <input v-model.trim="newsletterForm.email" type="email" name="newsletter_email" required />
            </label>
            <button class="button button-primary" type="submit" :disabled="submitState.newsletter === 'submitting'">
              Subscribe
            </button>
            <p class="form-status" :class="submitState.newsletter" aria-live="polite">{{ submitMessage.newsletter }}</p>
          </form>
        </section>

        <section class="section faq-section" data-analytics-section="faq">
          <div class="section-heading">
            <p class="eyebrow">FAQ</p>
            <h2>Deep scroll content for attention and scroll maps.</h2>
          </div>
          <details v-for="[question, answer] in faqs" :key="question">
            <summary>{{ question }}</summary>
            <p>{{ answer }}</p>
          </details>
        </section>
      </template>

      <template v-else-if="currentRoute.key === 'menu' || currentRoute.key === 'promotions' || currentRoute.key === 'about'">
        <section class="section subpage-hero">
          <p class="eyebrow">{{ currentRoute.label }}</p>
          <h1>{{ currentRoute.label }} at Saffron Table</h1>
          <p>
            This page repeats the landing page content in a focused route so SPA pageview and path
            tracking can compare multiple URLs with similar sections.
          </p>
        </section>
        <section class="section menu-board">
          <article v-for="section in menuSections" :key="section.title" class="menu-section">
            <h2>{{ section.title }}</h2>
            <div v-for="item in section.items" :key="item[0]" class="menu-row">
              <div>
                <h3>{{ item[0] }}</h3>
                <p>{{ item[2] }}</p>
              </div>
              <strong>{{ item[1] }}</strong>
            </div>
          </article>
        </section>
      </template>

      <template v-else-if="currentRoute.key === 'reservation'">
        <section class="section subpage-hero">
          <p class="eyebrow">Reservation</p>
          <h1>Reserve a table and test form analytics.</h1>
          <p>Required fields, selects, checkbox, textarea, and submit success route are included.</p>
        </section>
        <section class="section form-section">
          <form class="data-form" @submit.prevent="submitForm('reservation', reservationForm, '/reservation/success')">
            <label>Full name<input v-model.trim="reservationForm.name" name="reservation_name" required /></label>
            <label>Email<input v-model.trim="reservationForm.email" name="reservation_email" type="email" required /></label>
            <label>Phone<input v-model.trim="reservationForm.phone" name="reservation_phone" type="tel" required /></label>
            <label>Date<input v-model="reservationForm.date" name="reservation_date" type="date" required /></label>
            <label>Time<input v-model="reservationForm.time" name="reservation_time" type="time" required /></label>
            <label>Guests<select v-model="reservationForm.guests" name="reservation_guests"><option v-for="n in 8" :key="n">{{ n }}</option></select></label>
            <label>Occasion<select v-model="reservationForm.occasion" name="reservation_occasion"><option>Dinner</option><option>Birthday</option><option>Business meal</option><option>Private event</option></select></label>
            <fieldset>
              <legend>Seating</legend>
              <label><input v-model="reservationForm.seating" type="radio" value="Dining room" name="seating" /> Dining room</label>
              <label><input v-model="reservationForm.seating" type="radio" value="Terrace" name="seating" /> Terrace</label>
            </fieldset>
            <label class="form-full">Special requests<textarea v-model.trim="reservationForm.message" name="reservation_message" rows="5" required></textarea></label>
            <label class="checkbox-line form-full"><input v-model="reservationForm.updates" type="checkbox" name="reservation_updates" /> Send dining updates</label>
            <div class="form-actions form-full">
              <button class="button button-primary" type="submit" :disabled="submitState.reservation === 'submitting'">Confirm reservation</button>
              <p class="form-status" :class="submitState.reservation" aria-live="polite">{{ submitMessage.reservation }}</p>
            </div>
          </form>
        </section>
      </template>

      <template v-else-if="currentRoute.key === 'order'">
        <section class="section subpage-hero">
          <p class="eyebrow">Pickup order</p>
          <h1>Create an order and test conversion behavior.</h1>
          <p>Use this route for order funnel testing from landing page CTA to submit success.</p>
        </section>
        <section class="section form-section">
          <form class="data-form" @submit.prevent="submitForm('order', orderForm, '/order/success')">
            <label>Full name<input v-model.trim="orderForm.name" name="order_name" required /></label>
            <label>Email<input v-model.trim="orderForm.email" name="order_email" type="email" required /></label>
            <label>Phone<input v-model.trim="orderForm.phone" name="order_phone" type="tel" required /></label>
            <label>Pickup time<input v-model="orderForm.pickupTime" name="pickup_time" type="time" required /></label>
            <label>Entree<select v-model="orderForm.entree" name="order_entree"><option v-for="dish in featuredDishes" :key="dish.name">{{ dish.name }}</option></select></label>
            <label>Quantity<input v-model.number="orderForm.quantity" name="order_quantity" type="number" min="1" max="12" required /></label>
            <label>Spice level<select v-model="orderForm.spice" name="spice_level"><option>Mild</option><option>Medium</option><option>Hot</option></select></label>
            <fieldset>
              <legend>Extras</legend>
              <label><input v-model="orderForm.extras" type="checkbox" value="Rice" name="extras" /> Rice</label>
              <label><input v-model="orderForm.extras" type="checkbox" value="Roti" name="extras" /> Roti</label>
              <label><input v-model="orderForm.extras" type="checkbox" value="Dessert" name="extras" /> Dessert</label>
            </fieldset>
            <label class="form-full">Kitchen notes<textarea v-model.trim="orderForm.message" name="order_message" rows="5" required></textarea></label>
            <div class="form-actions form-full">
              <button class="button button-primary" type="submit" :disabled="submitState.order === 'submitting'">Send pickup order</button>
              <p class="form-status" :class="submitState.order" aria-live="polite">{{ submitMessage.order }}</p>
            </div>
          </form>
        </section>
      </template>

      <template v-else-if="currentRoute.key === 'contact'">
        <section class="section subpage-hero">
          <p class="eyebrow">Contact</p>
          <h1>Ask about events, catering, and group dining.</h1>
          <p>This page has three separate forms so form analytics can compare multiple forms on one route.</p>
        </section>
        <section class="section form-section">
          <form class="data-form" @submit.prevent="submitForm('contact', contactForm, '/contact/success')">
            <label>Full name<input v-model.trim="contactForm.name" name="contact_name" required /></label>
            <label>Email<input v-model.trim="contactForm.email" name="contact_email" type="email" required /></label>
            <label>Topic<select v-model="contactForm.topic" name="contact_topic"><option>Private dining</option><option>Catering</option><option>Press</option><option>Feedback</option></select></label>
            <label class="form-full">Message<textarea v-model.trim="contactForm.message" name="contact_message" rows="7" required></textarea></label>
            <div class="form-actions form-full">
              <button class="button button-primary" type="submit" :disabled="submitState.contact === 'submitting'">Send message</button>
              <p class="form-status" :class="submitState.contact" aria-live="polite">{{ submitMessage.contact }}</p>
            </div>
          </form>

          <form class="data-form secondary-form" @submit.prevent="submitForm('catering', cateringForm, '/contact/success')">
            <label>Event contact<input v-model.trim="cateringForm.name" name="catering_name" required /></label>
            <label>Email<input v-model.trim="cateringForm.email" name="catering_email" type="email" required /></label>
            <label>Phone<input v-model.trim="cateringForm.phone" name="catering_phone" type="tel" required /></label>
            <label>Event date<input v-model="cateringForm.date" name="catering_date" type="date" required /></label>
            <label>Guest count<select v-model="cateringForm.guests" name="catering_guests"><option>20</option><option>35</option><option>50</option><option>75</option><option>100+</option></select></label>
            <label>Occasion<select v-model="cateringForm.occasion" name="catering_occasion"><option>Office lunch</option><option>Wedding party</option><option>Product launch</option><option>Family celebration</option></select></label>
            <label class="form-full">Catering details<textarea v-model.trim="cateringForm.message" name="catering_message" rows="5" required></textarea></label>
            <div class="form-actions form-full">
              <button class="button button-primary" type="submit" :disabled="submitState.catering === 'submitting'">Request catering</button>
              <p class="form-status" :class="submitState.catering" aria-live="polite">{{ submitMessage.catering }}</p>
            </div>
          </form>

          <form class="data-form secondary-form" @submit.prevent="submitForm('feedback', feedbackForm, '/contact/success')">
            <label>Your name<input v-model.trim="feedbackForm.name" name="feedback_name" required /></label>
            <label>Email<input v-model.trim="feedbackForm.email" name="feedback_email" type="email" required /></label>
            <label>Feedback type<select v-model="feedbackForm.topic" name="feedback_topic"><option>Dining experience</option><option>Pickup order</option><option>Service note</option><option>Website issue</option></select></label>
            <label class="form-full">Feedback<textarea v-model.trim="feedbackForm.message" name="feedback_message" rows="6" required></textarea></label>
            <div class="form-actions form-full">
              <button class="button button-primary" type="submit" :disabled="submitState.feedback === 'submitting'">Send feedback</button>
              <p class="form-status" :class="submitState.feedback" aria-live="polite">{{ submitMessage.feedback }}</p>
            </div>
          </form>
        </section>
      </template>

      <template v-else-if="currentRoute.key === 'success'">
        <section class="section success-section" data-conversion="true">
          <p class="eyebrow">Success</p>
          <h1>Your request was submitted.</h1>
          <p>This route is intentionally separate so conversion and funnel tools can detect a completed flow.</p>
          <div class="hero-actions">
            <a class="button button-primary" href="/" @click="handleRouteClick($event, '/')">Back home</a>
            <a class="button button-secondary" href="/menu" @click="handleRouteClick($event, '/menu')">View menu</a>
          </div>
        </section>
      </template>
    </main>

    <footer class="site-footer" data-snapshot-region="footer">
      <div>
        <a class="brand" href="/" @click="handleRouteClick($event, '/')">
          <span class="brand-mark">ST</span>
          <span>Saffron Table</span>
        </a>
        <p>118 Ember Lane, Bangkok. Open daily 11:30-23:00.</p>
      </div>
      <nav aria-label="Footer navigation">
        <a v-for="route in routes" :key="route.key" :href="route.path" @click="handleRouteClick($event, route.path)">
          {{ route.label }}
        </a>
      </nav>
    </footer>
  </div>
</template>
