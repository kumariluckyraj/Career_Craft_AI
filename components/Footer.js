import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-black/10 bg-white/70 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Top */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          
          {/* Brand */}
          <div>
            <h3 className="text-lg font-semibold">Kumari Lucky Raj</h3>
            <p className="text-sm text-black/60 mt-2 leading-relaxed">
              Building AI-powered tools for developers, professionals,
              and modern careers.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide">
              Contact
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-black/70">
              <li>
                📞 <span className="ml-1">+91 86101 32839</span>
              </li>
              <li>
                ✉️{" "}
                <a
                  href="mailto:dezikumari92@gmail.com"
                  className="ml-1 hover:underline"
                >
                  dezikumari92@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide">
              Social
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href="https://www.linkedin.com/in/kumari-lucky-raj-2a52b0323"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-black/70"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/kumariluckyraj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-black/70"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between text-xs text-black/50">
          <p>© {new Date().getFullYear()} kumari Lucky Raj. All rights reserved.</p>
          
        </div>
      </div>
    </footer>
  );
}
