export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-6 sm:py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center sm:text-left">
          {/* Contact Info */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2">contact info</h3>
            <a
              href="mailto:info@islamicknowledgecards.com"
              className="text-xs sm:text-sm text-gray-600 hover:text-teal-600 transition-colors"
            >
              info@islamicknowledgecards.com
            </a>
          </div>

          {/* Instagram */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2">instagram</h3>
            <a
              href="https://instagram.com/islamicknowledgecards"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-gray-600 hover:text-teal-600 transition-colors"
            >
              @islamicknowledgecards
            </a>
          </div>

          {/* Credits */}
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">
              created by, vKuunteer of <span className="font-semibold">Kim Yaafi</span>
            </p>
            <p className="text-xs text-gray-500">all rights reserved</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
