"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Icons } from "@/src/components/icons";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Instagram,
} from "lucide-react";
import { useState } from "react";

type FormStatus = "idle" | "loading" | "success" | "error";

export function ContactSection() {
  const t = useTranslations("ContactSection");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpar mensagens de erro quando o usuário começar a digitar
    if (formStatus === "error") {
      setFormStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("form.errorDefault"));
      }

      setFormStatus("success");
      // Reset form após sucesso
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Voltar ao estado inicial após 5 segundos
      setTimeout(() => {
        setFormStatus("idle");
      }, 5000);
    } catch (error) {
      setFormStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : t("form.errorUnknown")
      );
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: t("email"),
      value: "lmfg10@gmail.com",
      href: "mailto:lmfg10@gmail.com",
    },
    {
      icon: MapPin,
      label: t("location"),
      value: "Rondônia, Brasil.",
      href: null,
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/LuisMFG",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://linkedin.com/in/celodev11",
    },
    {
      icon: Instagram,
      label: "Instagram",
      href: "https://instagram.com/celo11_",
    },
  ];

  const getButtonContent = () => {
    switch (formStatus) {
      case "loading":
        return (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{t("form.sending")}</span>
          </>
        );
      case "success":
        return (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>{t("form.success")}</span>
          </>
        );
      case "error":
        return (
          <>
            <AlertCircle className="w-5 h-5" />
            <span>{t("form.tryAgain")}</span>
          </>
        );
      default:
        return (
          <>
            <Send className="w-5 h-5" />
            <span>{t("form.submit")}</span>
          </>
        );
    }
  };

  const getButtonColor = () => {
    switch (formStatus) {
      case "success":
        return "bg-green-600 hover:bg-green-700";
      case "error":
        return "bg-red-600 hover:bg-red-700";
      default:
        return "bg-primary hover:bg-primary/90";
    }
  };

  return (
    <section
      id="contact"
      className="min-h-screen snap-start flex items-center p-8"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto w-full"
      >
        <h2 className="text-3xl font-bold mb-12 text-center">
          {t("title")} <Icons />
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Informações de Contato */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-semibold text-primary mb-6">
                {t("getInTouch")}
              </h3>
              <p className="text-muted-foreground mb-8">{t("description")}</p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <info.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{info.label}</p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-muted-foreground">{info.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Redes Sociais */}
            <div className="pt-8 border-t border-border">
              <h4 className="text-lg font-semibold mb-4">{t("followMe")}</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
                  >
                    <social.icon className="w-6 h-6 text-primary" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Formulário de Contato */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-semibold text-primary mb-6">
              {t("sendMessage")}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    {t("form.name")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={formStatus === "loading"}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-background disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder={t("form.namePlaceholder")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    {t("form.email")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={formStatus === "loading"}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-background disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder={t("form.emailPlaceholder")}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium mb-2"
                >
                  {t("form.subject")}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  disabled={formStatus === "loading"}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-background disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder={t("form.subjectPlaceholder")}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  {t("form.message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  disabled={formStatus === "loading"}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-background resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder={t("form.messagePlaceholder")}
                />
              </div>

              {/* Mensagem de erro */}
              {formStatus === "error" && errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{errorMessage}</p>
                </div>
              )}

              {/* Mensagem de sucesso */}
              {formStatus === "success" && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">
                    {t("form.successMessage")}
                  </p>
                </div>
              )}

              <motion.button
                type="submit"
                disabled={formStatus === "loading" || formStatus === "success"}
                whileHover={{ scale: formStatus === "loading" ? 1 : 1.02 }}
                whileTap={{ scale: formStatus === "loading" ? 1 : 0.98 }}
                className={`w-full ${getButtonColor()} text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {getButtonContent()}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
