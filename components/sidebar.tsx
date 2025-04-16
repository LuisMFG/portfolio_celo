"use client"

import { motion } from "framer-motion"
import { ThemeToggle } from "./theme-toggle"
import { Home, User, Code2, Briefcase, FolderGit2, Github, Linkedin, Instagram } from "lucide-react"
import Link from "next/link"

const menuItems = [
  { href: "#home", icon: Home, label: "Início" },
  { href: "#about", icon: User, label: "Sobre" },
  { href: "#skills", icon: Code2, label: "Tecnologias" },
  { href: "#experience", icon: Briefcase, label: "Experiência" },
  { href: "#projects", icon: FolderGit2, label: "Projetos" },
]

const socialLinks = [
  { href: "https://github.com/yourusername", icon: Github, label: "GitHub" },
  { href: "https://linkedin.com/in/yourusername", icon: Linkedin, label: "LinkedIn" },
  { href: "https://instagram.com/yourusername", icon: Instagram, label: "Instagram" },
]

export function Sidebar() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <motion.nav
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 top-0 h-screen w-16 flex flex-col items-center py-8 bg-background/80 backdrop-blur-sm border-r border-border md:w-20 z-50"
    >
      <div className="flex-1 flex flex-col gap-4">
        {menuItems.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={(e) => handleClick(e, item.href)}
            className="p-3 hover:bg-accent rounded-lg transition-colors relative group"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <item.icon className="w-6 h-6" />
              <span className="sr-only">{item.label}</span>
              <div className="absolute left-full ml-2 px-2 py-1 bg-accent rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {item.label}
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
      
      <div className="flex flex-col gap-4 mb-4">
        {socialLinks.map((item, index) => (
          <motion.a
            key={item.href}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 hover:bg-accent rounded-lg transition-colors relative group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <item.icon className="w-6 h-6" />
            <span className="sr-only">{item.label}</span>
            <div className="absolute left-full ml-2 px-2 py-1 bg-accent rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              {item.label}
            </div>
          </motion.a>
        ))}
      </div>
      
      <ThemeToggle />
    </motion.nav>
  )
}