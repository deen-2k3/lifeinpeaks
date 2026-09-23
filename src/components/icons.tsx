type P = React.SVGProps<SVGSVGElement>;
const base = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const SearchIcon = (p: P) => (<svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>);
export const HeartIcon = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base} {...p} fill={filled ? "currentColor" : "none"}><path d="M12 20s-7-4.4-9.2-9A5 5 0 0 1 12 6a5 5 0 0 1 9.2 5c-2.2 4.6-9.2 9-9.2 9Z" /></svg>
);
export const CloseIcon = (p: P) => (<svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>);
export const MenuIcon = (p: P) => (<svg {...base} {...p}><path d="M4 8h16M4 16h16" /></svg>);
export const ArrowRight = (p: P) => (<svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const ArrowLeft = (p: P) => (<svg {...base} {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>);
export const ChevronLeft = (p: P) => (<svg {...base} {...p}><path d="m15 5-7 7 7 7" /></svg>);
export const ChevronRight = (p: P) => (<svg {...base} {...p}><path d="m9 5 7 7-7 7" /></svg>);
export const PinIcon = (p: P) => (<svg {...base} {...p}><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.2" /></svg>);
export const CalendarIcon = (p: P) => (<svg {...base} {...p}><rect x="3.5" y="5" width="17" height="15" rx="1.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>);
export const CameraIcon = (p: P) => (<svg {...base} {...p}><path d="M4 8h3l2-2.5h6L17 8h3v11H4Z" /><circle cx="12" cy="13" r="3.5" /></svg>);
export const InfoIcon = (p: P) => (<svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>);
export const ExpandIcon = (p: P) => (<svg {...base} {...p}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>);
export const InstagramIcon = (p: P) => (<svg {...base} {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="4.5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r=".6" fill="currentColor" /></svg>);
export const FacebookIcon = (p: P) => (<svg {...base} {...p}><path d="M14 8.5h2.5V5H14a3.5 3.5 0 0 0-3.5 3.5V11H8v3.5h2.5V21H14v-6.5h2.5L17 11h-3V9a.5.5 0 0 1 .5-.5Z" /></svg>);
export const YoutubeIcon = (p: P) => (<svg {...base} {...p}><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="m10.5 9.5 4 2.5-4 2.5Z" fill="currentColor" /></svg>);
export const MountainIcon = (p: P) => (<svg {...base} {...p}><path d="M2.5 19.5 9 9l3.5 5.5L15 11l6.5 8.5Z" /><path d="m7.4 11.6 1.6 1 1.6-1.4" /></svg>);
export const MapIcon = (p: P) => (<svg {...base} {...p}><path d="M3.5 6.5 9 4l6 2.5L20.5 4v13.5L15 20l-6-2.5L3.5 20Z" /><path d="M9 4v13.5M15 6.5V20" /></svg>);
export const PeaksIcon = (p: P) => (<svg {...base} {...p}><path d="M2 19.5 9.5 7l4 6.5 2-3 6.5 9Z" /><path d="m7.6 10.2 1.9 1.3 1.6-1.6M14.3 11.4l1.2.9.9-.8" /></svg>);
export const PlayIcon = (p: P) => (<svg {...base} {...p}><path d="M9 7.5v9l7.5-4.5Z" fill="currentColor" stroke="none" /></svg>);
export const XIcon = (p: P) => (<svg {...base} {...p}><path d="M4 4l16 16M20 4 4 20" strokeWidth={1.6} /></svg>);
export const PinterestIcon = (p: P) => (<svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M11 8.5c3.5-1 5.5 1 5 3.5-.4 2-2.1 3.3-3.8 2.6M11.6 10l-2.4 10" /></svg>);
