# CLAUDE.md - Expense Tracker CRUD Application

## Project Overview

This is a mobile-first Progressive Web App (PWA) for expense tracking with advanced categorization and analytics. Built with Express.js and MongoDB/Mongoose, the application allows users to manage their expenses with Goal/Need/Want (GNW) tagging, category-based tracking, and visual analytics.

**Repository**: Imdni8/Expense_tracker_CRUD
**Main Entry Point**: `index.js`
**Port**: Configured via `process.env.PORT` (default: 3000)

## Project Vision & Goals

### Core Features
1. **GNW Tagging System**: Every expense tagged as Goal, Need, or Want for intentional spending tracking
2. **Category-Based Tracking**: Optional categorization (Groceries, Transport, Entertainment, etc.) with "Untagged" fallback
3. **Visual Analytics**: Monthly spending breakdown by category and GNW with charts
4. **Mobile-First PWA**: Installable app with offline capability and native app feel
5. **Bottom Navigation**: Easy thumb-friendly navigation between Transactions, Add Expense, and Analytics

### Future Enhancements
- Multi-user authentication and isolated user data
- Amortization feature for spreading long-term expenses over months
- Budget tracking and alerts

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB via Mongoose 8.0.3
- **Template Engine**: EJS 3.1.9
- **Frontend**:
  - Tailwind CSS (utility-first mobile-first styling)
  - Alpine.js (lightweight JavaScript for interactivity)
  - Chart.js (data visualization for analytics)
- **Key Middleware**:
  - `method-override`: Enables HTTP methods like PUT/PATCH/DELETE via query string
  - `dotenv`: Environment variable management
- **Dev Tools**: Nodemon 3.0.2 (for development auto-reload)
- **PWA**: Service Worker, Web App Manifest

## Project Structure

```
Expense_tracker_CRUD/
├── index.js                    # Main application file (routes, server config)
├── package.json                # Dependencies and scripts
├── .env                        # Environment variables (gitignored)
├── .gitignore                  # Git ignore rules
├── Mongoose_models/            # Database models
│   └── Expense.js             # Expense model schema
└── views/                      # EJS templates
    ├── expenses.ejs           # Main page - list all expenses
    ├── newexpense.ejs         # Form to add new expense
    ├── editExpense.ejs        # Form to edit existing expense
    └── expenseDetails.ejs     # Show single expense details
```

## Database Schema

### Expense Model (`Mongoose_models/Expense.js`)

```javascript
{
  value: {
    type: Number,
    min: 0,
    required: true
  },
  expenseDate: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: false,
    enum: [
      'Groceries', 'Transport', 'Entertainment', 'Bills & Utilities',
      'Shopping', 'Food & Dining', 'Health & Fitness', 'Home & Garden',
      'Travel', 'Education', 'Work', 'Gifts', 'Subscriptions', 'Other', null
    ]
  },
  gnw: {
    type: String,
    required: true,
    enum: ['Goal', 'Need', 'Want'],
    default: 'Need'
  },
  description: {
    type: String,
    required: false
  }
}
```

**Model Location**: `Mongoose_models/Expense.js:3-44`
**Collection Name**: `expenses` (auto-pluralized by Mongoose)

**Field Notes**:
- `category`: Optional categorization. If not provided, will show as "Untagged" in UI
- `gnw`: Required GNW tagging (Goal/Need/Want) for intentional spending tracking
- `description`: Optional text notes about the expense

## Routes and API Endpoints

All routes are defined in `index.js:49-111`

| Method | Route | Description | View/Action |
|--------|-------|-------------|-------------|
| GET | `/expenses` | List all expenses | Renders `expenses.ejs` |
| GET | `/addexpense` | Show add expense form | Renders `newexpense.ejs` |
| POST | `/addexpense` | Create new expense | Redirects to `/expenses` |
| GET | `/expenses/:id` | Show expense details | Renders `expenseDetails.ejs` |
| GET | `/expenses/:id/edit` | Show edit form | Renders `editExpense.ejs` |
| PATCH | `/expenses/:id` | Update expense | Redirects to `/expenses` |
| DELETE | `/expenses/:id` | Delete expense | Redirects to `/expenses` |

### Route Handler Notes

1. **POST `/addexpense`** (index.js:64-76):
   - If `expenseDate` is provided, uses it; otherwise defaults to today's date
   - Uses `baseURL` for redirects (Render.com deployment compatibility)

2. **PATCH `/expenses/:id`** (index.js:93-104):
   - Validates both `value` and `expenseDate` are present
   - Falls back to today's date if only `value` provided

3. **Method Override**: Forms use `?_method=PATCH` or `?_method=DELETE` query strings (index.js:20)

## Environment Variables

Required environment variables (stored in `.env`, which is gitignored):

- `db_URL`: MongoDB connection string (Atlas or local)
- `PORT`: Server port (optional, defaults to 3000)
- `RENDER_URL`: Base URL for production deployment (Render.com)

**Configuration Location**: `index.js:6,23,38,40`

### Database Connection

- Connection established at startup (index.js:27-32)
- Uses environment variable `db_URL` for flexibility between local and cloud MongoDB
- Falls back option: `mongodb://localhost/expenseApp` (commented out)

## Development Workflow

### Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Create `.env` file**:
   ```
   db_URL=mongodb://localhost/expenseApp
   PORT=3000
   RENDER_URL=http://localhost:3000
   ```

3. **Start Development Server**:
   ```bash
   npm run Devstart  # Uses nodemon for auto-reload
   ```

4. **Start Production Server**:
   ```bash
   npm start  # Uses node directly
   ```

### NPM Scripts

- `npm run Devstart`: Development mode with nodemon (auto-reloads on file changes)
- `npm start`: Production mode with node

## Git Workflow & Branching

### Current Branch Convention

The repository uses feature branches with the pattern: `claude/claude-md-*`

**Active Development Branch**: `claude/claude-md-mi2t29gtc1gz6r9d-01W3Z1qGjQS6zAkKCaeLcwji`

### Branch Naming Convention

- Feature branches: `claude/claude-md-<session-id>`
- **CRITICAL**: When pushing, branch MUST start with `claude/` and end with matching session ID
- Push failures (403 errors) indicate incorrect branch naming

### Git Commands

**Pushing changes**:
```bash
git push -u origin <branch-name>
```

**Fetching/Pulling**:
```bash
git fetch origin <branch-name>
git pull origin <branch-name>
```

### Recent Changes (Last 5 Commits)

1. Updated EJS templates with `baseURL` variable for Render deployment
2. Added `baseURL` configuration using `process.env.RENDER_URL`
3. Configured PORT environment variable for deployment
4. Cleaned up repository (removed node_modules, .env)
5. Added .gitignore for sensitive files

## Key Conventions for AI Assistants

### Code Style

1. **Async/Await**: Used consistently for database operations (index.js:52-110)
2. **Destructuring**: Parameters extracted via destructuring (e.g., `const { id } = req.params`)
3. **Template Variables**: Passed as objects to EJS (e.g., `{ expenses }`, `{ foundExpense }`)
4. **Comments**: Minimal inline comments; section dividers used (e.g., `//------// Routes //------//`)

### Naming Conventions

- **Routes**: Lowercase with forward slashes (`/expenses`, `/addexpense`)
- **Models**: PascalCase (`Expense`)
- **Variables**: camelCase (`newExpense`, `foundExpense`, `baseURL`)
- **Files**: camelCase for JS files, lowercase for views (`Expense.js`, `expenses.ejs`)

### Database Patterns

1. **Model Import**: Single model imported at top (index.js:35)
2. **CRUD Operations**:
   - Create: `new Model(data).save()`
   - Read: `Model.find()`, `Model.findById(id)`
   - Update: `Model.findByIdAndUpdate(id, data)`
   - Delete: `Model.findByIdAndDelete(id)`

### View Rendering

1. **Base URL**: All views use `baseURL` variable for links (index.js:40-41)
   - Set via `app.locals.baseURL` for global access in templates
   - Enables deployment flexibility (localhost vs Render.com)

2. **Data Passing**: Named objects passed to views
   ```javascript
   res.render("expenses.ejs", { expenses })
   res.render("expenseDetails.ejs", { foundExpense })
   ```

3. **Template Variables**: Views access via EJS syntax `<%= variable %>`

### Error Handling

**Current State**: Minimal error handling implemented
- Database connection errors caught (index.js:30-32)
- No try/catch blocks around route handlers
- No validation middleware

**Recommendation for Future**: Add proper error handling middleware and validation

### Form Handling

1. **Body Parsing**: `express.urlencoded({ extended: true })` (index.js:17)
2. **Method Override**: Query string parameter `_method` (index.js:20)
3. **Date Handling**: Defaults to today if not provided (index.js:71, 100)

## Deployment Configuration

### Render.com Deployment

The application is configured for Render.com deployment:

1. **Base URL Configuration** (index.js:40-41):
   - Uses `RENDER_URL` environment variable in production
   - Falls back to `http://localhost:3000` for local development
   - Set as `app.locals.baseURL` for template access

2. **Port Configuration** (index.js:38):
   - Reads from `process.env.PORT` (Render assigns dynamically)
   - Falls back to 3000 for local development

3. **MongoDB Atlas**: Use cloud-hosted MongoDB (set via `db_URL` env variable)

### Environment Setup for Production

```
db_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/expenseApp
PORT=<assigned-by-render>
RENDER_URL=https://your-app-name.onrender.com
```

## Common AI Assistant Tasks

### Adding New Routes

1. Define route in `index.js` after line 49
2. Use async/await for database operations
3. Redirect using `${baseURL}` for deployment compatibility
4. Create corresponding EJS template in `views/` if needed

### Modifying Database Schema

1. Edit `Mongoose_models/Expense.js`
2. Add new fields with type, required, and validation rules
3. Update affected routes and views
4. Consider data migration for existing records

### Creating New Views

1. Create `.ejs` file in `views/` directory
2. Include basic HTML structure
3. Access `baseURL` variable for all internal links: `<%= baseURL %>/path`
4. Use EJS syntax for dynamic content: `<%= variable %>`, `<% logic %>`

### Adding Dependencies

1. Install via npm: `npm install package-name`
2. Import in `index.js` or relevant file
3. Configure middleware if needed (between lines 6-20 in index.js)
4. Update this documentation if it's a significant addition

### Testing Changes

1. Start dev server: `npm run Devstart`
2. Visit `http://localhost:3000/expenses`
3. Test CRUD operations:
   - Create: Click "Add new expense"
   - Read: View list and details
   - Update: Click "Edit" on an expense
   - Delete: Use delete button on details page

## Troubleshooting

### Common Issues

1. **Database Connection Fails**:
   - Check `db_URL` in `.env`
   - Verify MongoDB is running (local) or connection string is correct (Atlas)
   - Check network connectivity for Atlas

2. **Port Already in Use**:
   - Change `PORT` in `.env`
   - Kill existing process: `lsof -ti:3000 | xargs kill -9` (Mac/Linux)

3. **Views Not Found**:
   - Verify views directory path (index.js:14)
   - Check file names match exactly (case-sensitive)

4. **Method Override Not Working**:
   - Ensure forms include `?_method=PATCH` or `?_method=DELETE`
   - Verify middleware is loaded (index.js:20)

5. **Deployment Issues on Render**:
   - Ensure `RENDER_URL` is set correctly
   - Check all redirects use `${baseURL}` prefix
   - Verify environment variables are set in Render dashboard

## File Modification Guidelines

### When Editing `index.js`

- Keep middleware declarations together (lines 10-20)
- Place new routes logically grouped with existing ones
- Maintain consistent async/await pattern
- Use `baseURL` for all redirects
- Add comments for route sections if adding many new routes

### When Editing Views

- Preserve existing HTML structure
- Always use `<%= baseURL %>` for internal links
- Maintain consistent formatting/indentation
- Test in browser after changes

### When Editing Models

- Follow Mongoose schema conventions
- Add appropriate validation rules
- Update dependent routes after schema changes
- Consider backward compatibility with existing data

## Security Considerations

**Current State**: Basic security only (educational project)

**Missing Security Features** (consider adding for production):
- Input validation/sanitization
- Authentication/Authorization
- CSRF protection
- Rate limiting
- Helmet.js for security headers
- MongoDB injection protection (use sanitization)

## Performance Considerations

**Current State**: Suitable for small-scale use

**Potential Optimizations**:
- Add database indexing on frequently queried fields
- Implement pagination for expense list (currently loads all)
- Add caching for static assets
- Use connection pooling for MongoDB

## Additional Notes

- **No Authentication**: Anyone can view/edit all expenses (single-user assumed)
- **Date Handling**: Uses locale string formatting in views
- **Validation**: Minimal validation (only schema-level in Mongoose)
- **Styling**: Modern mobile-first design with Tailwind CSS

---

## 🚀 Implementation Plan - PWA & Feature Enhancements

This project is being transformed from a basic CRUD app to a mobile-first PWA with advanced features. Implementation is divided into testable phases.

### **Phase 1: Database Schema Update** ✅ COMPLETED
**Goal:** Update expense model with new fields

**Changes:**
- ✅ Added `category` (String, optional) - 14 predefined categories
- ✅ Added `gnw` (String, required, enum: Goal/Need/Want, default: Need)
- ✅ Added `description` (String, optional)

**Testable Output:**
- ✅ Server starts without errors
- ✅ Existing functionality still works

---

### **Phase 2: Modern UI Foundation + Bottom Navigation** ✅ COMPLETED
**Goal:** Set up Tailwind CSS, Alpine.js, create mobile-first layout with bottom nav

**Changes:**
- ✅ Installed Tailwind CSS (via CDN)
- ✅ Installed Alpine.js for interactivity
- ✅ Created base layout with bottom navigation (3 tabs: Transactions, +, Analytics)
- ✅ Updated all existing views with new layout
- ✅ Mobile-first responsive design
- ✅ Added analytics placeholder page

**Testable Output:**
- ✅ App looks modern and mobile-friendly
- ✅ Bottom navigation visible on all pages
- ✅ Can navigate between pages via bottom nav
- ✅ Works smoothly on phone screen size

---

### **Phase 3: Update Add/Edit Expense Forms** ✅ COMPLETED
**Goal:** Add category, GNW, and description fields to forms

**Changes:**
- ✅ Updated `addexpense.ejs` with new fields (category dropdown, GNW toggle, description)
- ✅ Updated `editExpense.ejs` similarly
- ✅ Updated POST/PATCH routes to handle new fields
- ✅ Modern form styling with large touch targets
- ✅ Interactive GNW buttons with color-coded selection
- ✅ 14 predefined categories with emoji icons

**Testable Output:**
- ✅ Can add new expense with category, GNW, description
- ✅ Can edit expense and update all fields
- ✅ Form looks great on mobile
- ✅ GNW selection is clear and easy to use with visual feedback

---

### **Phase 4: Transactions Page Redesign** 🔄 IN PROGRESS
**Goal:** Modern card-based view filtered to current month

**Changes:**
- Update `expenses.ejs` → rename to `transactions.ejs`
- Show only current month expenses (MongoDB query filter)
- Card-based layout with amount, category badge, GNW colored badge, date
- Month selector at top
- Monthly total card

**Testable Output:**
- Home page shows only current month transactions
- Each expense displayed as attractive card
- Can see category and GNW tags clearly with colors
- Can change month to view past expenses
- Monthly total is visible

---

### **Phase 5: Analytics Page**
**Goal:** Visual breakdown of spending by category and GNW

**Changes:**
- Create `analytics.ejs`
- Add `GET /analytics` route with MongoDB aggregations
- Implement Chart.js visualizations (donut chart for categories, cards for GNW)
- Month selector (same as transactions)

**Testable Output:**
- Analytics page shows beautiful charts
- Can see spending breakdown by category (including "Untagged")
- Can see Goal/Need/Want breakdown with totals
- Can switch months to see historical analytics
- Works smoothly on mobile

---

### **Phase 6: PWA Setup**
**Goal:** Make app installable as mobile app

**Changes:**
- Create `manifest.json` with app metadata
- Add placeholder icons (192x192, 512x512)
- Add service worker for offline capability
- Add meta tags for PWA
- Add "Install App" prompt

**Testable Output:**
- Can install app on phone home screen
- App opens in standalone mode (no browser UI)
- Works offline (at least shows cached pages)
- Has app icon on home screen

---

### **Phase 7: Polish & Enhancements**
**Goal:** Final touches for smooth UX

**Changes:**
- Loading states
- Form validation feedback
- Smooth transitions/animations
- Empty states (no expenses)
- Confirmation before delete
- Toast notifications for actions

**Testable Output:**
- App feels polished and professional
- All interactions have feedback
- No jarring page transitions
- Clear messaging for all states

---

## Design System

### Color Scheme
- **Goal (🎯)**: Purple/Indigo (`bg-purple-100`, `text-purple-700`, `border-purple-500`)
- **Need (✅)**: Green (`bg-green-100`, `text-green-700`, `border-green-500`)
- **Want (❤️)**: Pink/Rose (`bg-pink-100`, `text-pink-700`, `border-pink-500`)
- **Untagged**: Gray (`bg-gray-100`, `text-gray-600`)
- **Background**: Clean whites/light grays
- **Primary Accent**: Indigo for buttons and highlights

### Category Icons & Mapping
- 🛒 Groceries
- 🚗 Transport
- 🎬 Entertainment
- 💰 Bills & Utilities
- 🛍️ Shopping
- 🍕 Food & Dining
- 🏥 Health & Fitness
- 🏠 Home & Garden
- ✈️ Travel
- 📚 Education
- 💼 Work
- 🎁 Gifts
- 📱 Subscriptions
- 🔧 Other

### Mobile-First Breakpoints
- Mobile: 320px - 640px (primary focus)
- Tablet: 641px - 1024px
- Desktop: 1025px+ (enhanced layout)

### Touch Target Guidelines
- Minimum 44px height for all interactive elements
- Adequate spacing between tap targets (8px minimum)
- Large form inputs (minimum 48px height)

---

**Last Updated**: 2025-11-17 (Phase 3 Completed, Phase 4 In Progress)
**Active Development Branch**: `claude/run-project-verification-01P3H11d4EcctB7tk2Vp3cDj`
