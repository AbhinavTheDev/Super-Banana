import { Toaster } from 'sonner'
import { Router, Route } from 'wouter'
import { Landing } from './pages/landing'
import { Generator } from './pages/generator'
import { Gallery } from './pages/gallery'

export default function App() {
  return (
    <div className="min-h-screen">
      <Router>
        <Route path="/" component={Landing} />
        <Route path="/generate" component={Generator} />
        <Route path="/gallery" component={Gallery} />
      </Router>
      <Toaster position="bottom-right" />
    </div>
  )
}
