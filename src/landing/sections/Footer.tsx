import { Film } from 'lucide-react';

type FooterProps = {
  T: (key: string) => string;
};

const Footer = ({ T }: FooterProps) => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <Film className="w-5 h-5 text-[#10B981]" />
              <span className="font-bold text-base">{T('nav.brand')}</span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              {T('hero.sub')}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-sm text-white/80 mb-4">{T('footer.product')}</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#how" className="text-sm text-white/40 hover:text-white/70 transition-colors">
                  {T('footer.features')}
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-sm text-white/40 hover:text-white/70 transition-colors">
                  {T('nav.pricing')}
                </a>
              </li>
              <li>
                <a href="#/studio" className="text-sm text-white/40 hover:text-white/70 transition-colors">
                  Studio
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm text-white/80 mb-4">{T('footer.company')}</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">
                  {T('footer.about')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">
                  {T('footer.contact')}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm text-white/80 mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#/terms" className="text-sm text-white/40 hover:text-white/70 transition-colors">
                  {T('footer.terms')}
                </a>
              </li>
              <li>
                <a href="#/privacy" className="text-sm text-white/40 hover:text-white/70 transition-colors">
                  {T('footer.privacy')}
                </a>
              </li>
              <li>
                <a href="#/acceptable-use" className="text-sm text-white/40 hover:text-white/70 transition-colors">
                  Acceptable Use
                </a>
              </li>
              <li>
                <a href="#/help" className="text-sm text-white/40 hover:text-white/70 transition-colors">
                  Help & Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 text-center">
          <p className="text-xs text-white/30">
            &copy; {year} Cinema AI Studio. {T('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
