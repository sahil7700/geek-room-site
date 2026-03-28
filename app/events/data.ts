export type EventType = "upcoming" | "past";

export type EventCategory = "hackathon" | "workshop" | "talk" | "other" | "tech-event";

export type TabType = "past" | "upcoming";

export interface TeamMember {
  name: string;
  role?: string;
}

export interface Winner {
  rank: string;
  banner?: string;
  photo?: string;
  teamName?: string;
  members?: string[];
}

export interface EventSection {
  type: "main" | "sub" | "winners" | "gallery" | "videos" | "media-archive";
  title: string;
  images: string[];
}

export interface EventDetails {
  slug: string;
  title: string;
  date: string;
  type: EventType;
  category?: EventCategory;
  description: string;
  image?: string;
  registrationLink?: string;
  location?: string;
  time?: string;
  winners?: Winner[];
  gallery?: string[];
  sections?: EventSection[];
  registrationOpen?: boolean;
}

export const eventsData: EventDetails[] = [
  {
    slug: "geek-veek-2",
    title: "Geek Veek 2.0",
    date: "2025-03-14",
    type: "past",
    category: "tech-event",
    description: "Geek Veek 2.0 marked an exciting evolution of our flagship tech event, bringing together over 200 students for a day of hands-on learning and innovation. Building on the success of our inaugural edition, this event expanded to include live coding demonstrations, interactive workshops on AI and web development, and an intense hackathon challenge. The energy was electric as participants collaborated on real-world projects, networked with industry mentors, and showcased their creative solutions to pressing tech problems. From the morning kickoff to the evening awards ceremony, the campus buzzed with the spirit of technological curiosity that defines GeekRoom.",
    image: "/images/events/geek-veek-2.0/main_event 5.jpg",
    location: "JEMTEC Campus",
    time: "10:00 AM - 6:00 PM",
    sections: [
      {
        type: "main",
        title: "Main Event Highlights",
        images: [
          "/images/events/geek-veek-2.0/main_event 5.jpg"
        ]
      },
      {
        type: "gallery",
        title: "Event Gallery",
        images: [
          "/images/events/geek-veek-2.0/photo_2026-03-14_14-46-29.jpg",
          "/images/events/geek-veek-2.0/photo_2026-03-14_14-46-43.jpg",
          "/images/events/geek-veek-2.0/photo_2026-03-14_14-46-51.jpg",
          "/images/events/geek-veek-2.0/photo_2026-03-14_14-47-09.jpg"
        ]
      },
      {
        type: "videos",
        title: "Event Videos",
        images: [
          "/images/events/geek-veek-2.0/video_2026-03-14_14-46-36.mp4",
          "/images/events/geek-veek-2.0/video_2026-03-14_14-46-58.mp4"
        ]
      },
      {
        type: "media-archive",
        title: "Media Archive",
        images: [
          "/images/events/geek-veek-2.0/video_2026-03-14_14-46-36.mp4",
          "/images/events/geek-veek-2.0/photo_2026-03-14_14-46-29.jpg",
          "/images/events/geek-veek-2.0/video_2026-03-14_14-46-58.mp4",
          "/images/events/geek-veek-2.0/photo_2026-03-14_14-46-43.jpg",
          "/images/events/geek-veek-2.0/photo_2026-03-14_14-46-51.jpg"
        ]
      }
    ]
  },
  {
    slug: "hackquanta",
    title: "Hackquanta",
    date: "2025-03-13",
    type: "past",
    category: "hackathon",
    description: "Hackquanta pushed the boundaries of innovation with its quantum-themed hacking challenge that combined cutting-edge technology with intense problem-solving. Teams of 2-3 members spent 12 hours developing solutions spanning quantum computing simulations, blockchain integrations, and machine learning applications. The hallways echoed with discussions about algorithmic optimizations while whiteboards filled with complex system architectures. What made Hackquanta special was not just the technical depth of the challenges, but the collaborative spirit that emerged—experienced programmers mentored newcomers, ideas crossed freely between teams, and friendships formed over shared debugging sessions. The winning teams impressed judges not just with working prototypes, but with thoughtful presentations of real-world applications for their innovations.",
    image: "/images/events/hackquanta/main_event 6.jpg",
    location: "JEMTEC Tech Hub",
    time: "9:00 AM - 9:00 PM",
    winners: [
      {
        rank: "1st",
        banner: "/images/events/hackquanta/1st winner banner.jpg",
        photo: "/images/events/hackquanta/1st winner photo.jpg",
        teamName: "Quantum Breakers"
      },
      {
        rank: "2nd",
        banner: "/images/events/hackquanta/2nd winner banner.jpg",
        photo: "/images/events/hackquanta/2nd winner photo.jpg",
        teamName: "Code Warriors"
      },
      {
        rank: "3rd",
        banner: "/images/events/hackquanta/3rd winner banner.jpg",
        photo: "/images/events/hackquanta/3rd winner photo.jpg",
        teamName: "Byte Masters"
      }
    ],
    sections: [
      {
        type: "main",
        title: "Main Event",
        images: ["/images/events/hackquanta/main_event 6.jpg"]
      },
      {
        type: "winners",
        title: "Winners Showcase",
        images: [
          "/images/events/hackquanta/1st winner banner.jpg",
          "/images/events/hackquanta/2nd winner banner.jpg",
          "/images/events/hackquanta/3rd winner banner.jpg"
        ]
      },
      {
        type: "gallery",
        title: "Event Gallery",
        images: [
          "/images/events/hackquanta/photo_2026-03-14_14-54-20.jpg",
          "/images/events/hackquanta/photo_2026-03-14_14-54-27.jpg",
          "/images/events/hackquanta/photo_2026-03-14_14-54-35.jpg"
        ]
      },
      {
        type: "media-archive",
        title: "Media Archive",
        images: [
          "/images/events/hackquanta/photo_2026-03-14_14-54-20.jpg",
          "/images/events/hackquanta/photo_2026-03-14_14-54-27.jpg",
          "/images/events/hackquanta/1st winner photo.jpg",
          "/images/events/hackquanta/photo_2026-03-14_14-54-35.jpg",
          "/images/events/hackquanta/2nd winner photo.jpg"
        ]
      }
    ]
  },
  {
    slug: "hackforce",
    title: "Hackforce",
    date: "2025-03-12",
    type: "past",
    category: "hackathon",
    description: "Hackforce delivered exactly what its name promised—an intense, relentless coding marathon through three competition tracks: Artificial Intelligence, Web Development, and Mobile Applications. Over 100 participants spent 24 hours transforming ideas into working prototypes, fueled by coffee, determination, and the infectious enthusiasm rippling through the tech lab. The atmosphere shifted from focused silence during coding sprints to animated debates during code reviews. Mentors from leading tech companies dropped valuable tips, while peer-to-peer learning happened organically as teams discovered shared challenges. By the dawn of the second day, sleep-deprived but beaming hackers emerged with impressive applications—from AI-powered assistants to mobile solutions addressing genuine community needs. Hackforce proved that great code comes from great collaboration.",
    image: "/images/events/hackforce/main_event 2 image 1.jpg",
    location: "JEMTEC Computer Lab",
    time: "10:00 AM - 10:00 AM (24hrs)",
    winners: [
      {
        rank: "1st",
        photo: "/images/events/hackforce/winners 1st.jpg",
        teamName: "Force One",
        members: ["Alex Chen", "Sarah Kim"]
      },
      {
        rank: "2nd",
        photo: "/images/events/hackforce/winners 2nd.jpg",
        teamName: "Binary Squad",
        members: ["Mike Johnson", "Emily Davis"]
      },
      {
        rank: "3rd",
        photo: "/images/events/hackforce/winners 3rd.jpg",
        teamName: "Code Knights",
        members: ["Rahul Patel", "Neha Singh"]
      }
    ],
    sections: [
      {
        type: "main",
        title: "Main Event",
        images: [
          "/images/events/hackforce/main_event 2 image 1.jpg",
          "/images/events/hackforce/main_event 2 image 2.jpg"
        ]
      },
      {
        type: "winners",
        title: "Winners",
        images: [
          "/images/events/hackforce/winners 1st.jpg",
          "/images/events/hackforce/winners 2nd.jpg",
          "/images/events/hackforce/winners 3rd.jpg"
        ]
      },
      {
        type: "gallery",
        title: "Gallery",
        images: [
          "/images/events/hackforce/photo_2026-03-14_14-32-46.jpg",
          "/images/events/hackforce/photo_2026-03-14_14-32-52.jpg",
          "/images/events/hackforce/photo_2026-03-14_14-32-57.jpg"
        ]
      },
      {
        type: "media-archive",
        title: "Media Archive",
        images: [
          "/images/events/hackforce/photo_2026-03-14_14-32-46.jpg",
          "/images/events/hackforce/winners 1st.jpg",
          "/images/events/hackforce/photo_2026-03-14_14-32-52.jpg",
          "/images/events/hackforce/winners 2nd.jpg",
          "/images/events/hackforce/photo_2026-03-14_14-32-57.jpg"
        ]
      }
    ]
  },
  {
    slug: "aptiverse",
    title: "Aptiverse",
    date: "2025-03-11",
    type: "past",
    category: "tech-event",
    description: "Aptiverse took participants on a journey through the vast universe of applications and technology, challenging them to discover and showcase their aptitude across diverse technical domains. The event unfolded with multiple parallel tracks: a coding competition testing algorithmic skills, a project exhibition where students demonstrated their applications, and lightning talks sharing knowledge on emerging technologies. What stood out was the accessibility—beginners found welcoming environments to learn basics, while experienced tech enthusiasts dove into advanced challenges. The camaraderie was palpable as students cheered each other's successes and collaborated through problems. Aptiverse wasn't just about competition; it was about celebrating the collective technical talent at JEMTEC and inspiring the next generation of innovators to reach for new heights in their technological journeys.",
    image: "/images/events/aptiverse/main_event 3.jpg",
    location: "JEMTEC Auditorium",
    time: "11:00 AM - 5:00 PM",
    winners: [
      {
        rank: "Champions",
        photo: "/images/events/aptiverse/winners.jpg",
        teamName: "Apt Warriors"
      }
    ],
    sections: [
      {
        type: "main",
        title: "Main Event",
        images: ["/images/events/aptiverse/main_event 3.jpg"]
      },
      {
        type: "winners",
        title: "Winners",
        images: ["/images/events/aptiverse/winners.jpg"]
      },
      {
        type: "gallery",
        title: "Event Gallery",
        images: [
          "/images/events/aptiverse/photo_2026-03-14_14-39-04.jpg",
          "/images/events/aptiverse/photo_2026-03-14_14-39-40.jpg",
          "/images/events/aptiverse/photo_2026-03-14_14-39-46.jpg",
          "/images/events/aptiverse/photo_2026-03-14_14-39-51.jpg",
          "/images/events/aptiverse/photo_2026-03-14_14-39-59.jpg"
        ]
      },
      {
        type: "media-archive",
        title: "Media Archive",
        images: [
          "/images/events/aptiverse/photo_2026-03-14_14-39-04.jpg",
          "/images/events/aptiverse/photo_2026-03-14_14-39-40.jpg",
          "/images/events/aptiverse/main_event 3.jpg",
          "/images/events/aptiverse/photo_2026-03-14_14-39-46.jpg",
          "/images/events/aptiverse/photo_2026-03-14_14-39-51.jpg"
        ]
      }
    ]
  },
  {
    slug: "blockgen",
    title: "BlockGen",
    date: "2025-03-10",
    type: "past",
    category: "workshop",
    description: "BlockGen demystified blockchain technology through an immersive hands-on workshop that took students from curious beginners to confident developers of decentralized applications. The session began with clear explanations of blockchain fundamentals—distributed ledgers, cryptographic hashing, and consensus mechanisms—before diving into practical development using Solidity and popular blockchain frameworks. Participants built their own smart contracts from scratch, each line of code bringing them closer to understanding how this revolutionary technology works under the hood. The workshop emphasized practical applications beyond cryptocurrency, exploring use cases in supply chain tracking, digital identity, and secure voting systems. By the end of the day, attendees had deployed their first decentralized applications and walked away not just with knowledge, but with the confidence to continue exploring this transformative technology on their own.",
    image: "/images/events/blockgen/main_event 4.jpg",
    location: "JEMTEC Lab 2",
    time: "2:00 PM - 6:00 PM",
    sections: [
      {
        type: "main",
        title: "Main Workshop",
        images: ["/images/events/blockgen/main_event 4.jpg"]
      },
      {
        type: "sub",
        title: "Sub Event",
        images: [
          "/images/events/blockgen/(sub event ) image 1.jpg",
          "/images/events/blockgen/(sub event) image 2.jpg"
        ]
      },
      {
        type: "gallery",
        title: "Gallery",
        images: [
          "/images/events/blockgen/photo_2026-03-14_14-42-21.jpg",
          "/images/events/blockgen/photo_2026-03-14_14-42-27.jpg",
          "/images/events/blockgen/photo_2026-03-14_14-42-32.jpg"
        ]
      },
      {
        type: "media-archive",
        title: "Media Archive",
        images: [
          "/images/events/blockgen/photo_2026-03-14_14-42-21.jpg",
          "/images/events/blockgen/(sub event ) image 1.jpg",
          "/images/events/blockgen/photo_2026-03-14_14-42-27.jpg",
          "/images/events/blockgen/(sub event) image 2.jpg",
          "/images/events/blockgen/photo_2026-03-14_14-42-32.jpg"
        ]
      }
    ]
  },
  {
    slug: "geek-veek-1",
    title: "Geek Veek",
    date: "2025-03-08",
    type: "past",
    category: "tech-event",
    description: "The very first Geek Veek set the stage for what would become GeekRoom's signature tech event, establishing traditions that would carry forward to future editions. This inaugural event was more than just a technical gathering—it was a宣言 declaration that our community values innovation, learning, and coming together to celebrate all things tech. Students participated in coding competitions that pushed their problem-solving abilities, attended tech talks that expanded their horizons, and engaged in interactive sessions that bridged the gap between theory and practical application. The energy was undeniable despite the challenges of organizing a first-of-its-kind event, and the feedback from participants exceeded all expectations. Geek Veek proved that when passionate tech enthusiasts gather, amazing things happen—friendships form, knowledge spreads, and the collective enthusiasm for technology creates an experience greater than the sum of its parts.",
    image: "/images/events/geek-veek/main_event1.jpg",
    location: "JEMTEC Campus",
    time: "10:00 AM - 4:00 PM",
    sections: [
      {
        type: "main",
        title: "Main Event",
        images: ["/images/events/geek-veek/main_event1.jpg"]
      },
      {
        type: "sub",
        title: "Sub Event",
        images: ["/images/events/geek-veek/event1(sub event).jpg"]
      },
      {
        type: "gallery",
        title: "Event Photos",
        images: [
          "/images/events/geek-veek/photo_2026-03-14_14-26-10.jpg",
          "/images/events/geek-veek/photo_2026-03-14_14-26-34.jpg"
        ]
      },
      {
        type: "videos",
        title: "Event Videos",
        images: [
          "/images/events/geek-veek/video_2026-03-14_14-25-59.mp4",
          "/images/events/geek-veek/video_2026-03-14_14-26-18.mp4",
          "/images/events/geek-veek/video_2026-03-14_14-26-26.mp4"
        ]
      },
      {
        type: "media-archive",
        title: "Media Archive",
        images: [
          "/images/events/geek-veek/video_2026-03-14_14-25-59.mp4",
          "/images/events/geek-veek/photo_2026-03-14_14-26-10.jpg",
          "/images/events/geek-veek/video_2026-03-14_14-26-18.mp4",
          "/images/events/geek-veek/main_event1.jpg",
          "/images/events/geek-veek/video_2026-03-14_14-26-26.mp4"
        ]
      }
    ]
  }
];
