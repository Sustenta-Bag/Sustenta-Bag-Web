"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaHome,
  FaBox,
  FaList,
  FaCog,
  FaShoppingBag,
  FaUserCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

interface NavLink {
  text: string;
  href: string;
  icon?: string;
  iconComponent?: React.ReactNode;
  position?: "left" | "right";
}

interface NavbarProps {
  title?: string;
  logoSrc?: string;
  links?: Array<NavLink>;
}

const Navbar: React.FC<NavbarProps> = ({
  title = "Logo",
  links = [
    { text: "Link 1", href: "#", icon: "home" },
    { text: "Link 2", href: "#", icon: "box" },
    { text: "Link 3", href: "#", icon: "list" },
    { text: "Link 4", href: "#", icon: "cog", position: "right" },
  ],
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();
  // Função para obter o ícone correspondente baseado no nome
  const getIconComponent = (iconName?: string) => {
    if (!iconName) return null;

    switch (iconName) {
      case "bx-home":
      case "home":
        return <FaHome className="text-lg" />;
      case "bx-box":
      case "bx-package":
      case "box":
        return <FaBox className="text-lg" />;
      case "bx-list-ul":
      case "list":
        return <FaList className="text-lg" />;
      case "bx-cog":
      case "cog":
        return <FaCog className="text-lg" />;
      case "bx-shopping-bag":
      case "shopping-bag":
        return <FaShoppingBag className="text-lg" />;
      case "bx-user-cog":
      case "user-cog":
        return <FaUserCog className="text-lg" />;
      case "logout":
      case "sign-out":
        return <FaSignOutAlt className="text-lg" />;
      default:
        return null;
    }
  };

  // Separar links por posição
  const leftLinks = links.filter((link) => link.position !== "right");
  const rightLinks = links.filter((link) => link.position === "right");

  // Fechar o menu quando a janela é redimensionada para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // md breakpoint
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Impedir a rolagem do body quando o menu estiver aberto em dispositivos móveis
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const renderLogoutButton = (isMobile: boolean = false) => (
    <button
      onClick={handleLogout}
      className={`
        text-[#efefef] no-underline flex items-center gap-2 bg-transparent border-none cursor-pointer
        ${
          isMobile
            ? "block w-full py-4 px-6 border-b border-gray-600 hover:bg-black/30 text-left"
            : "px-4 py-[13px] hover:bg-black/30"
        }
      `}
    >
      <FaSignOutAlt className="text-lg" />
      <span>Sair</span>
    </button>
  );

  // Renderiza um link com ícone
  const renderLink = (
    link: NavLink,
    index: number,
    isMobile: boolean = false
  ) => (
    <Link
      key={index}
      href={link.href}
      className={`
        text-[#efefef] no-underline flex items-center gap-2
        ${
          isMobile
            ? "block w-full py-4 px-6 border-b border-gray-600 hover:bg-black/30"
            : "px-4 py-[13px] hover:bg-black/30"
        }
      `}
      onClick={isMobile ? toggleMenu : undefined}
    >
      {link.iconComponent || getIconComponent(link.icon)}
      <span>{link.text}</span>
    </Link>
  );

  return (
    <nav className="bg-[#4d4d4d] h-[50px] w-full relative flex items-center justify-between z-50">
      {/* Header/Logo Section */}
      <div className="flex items-center z-20">
        <div className="inline-block text-white text-[22px] p-[10px]">
          {title}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div
        className="inline-block md:hidden absolute right-0 top-0 z-20"
        onClick={toggleMenu}
      >
        <label
          htmlFor="nav-check"
          className="inline-block w-[50px] h-[50px] p-[13px] hover:bg-black/30 cursor-pointer"
        >
          <span className="block w-[25px] h-[10px] border-t-2 border-[#eee]"></span>
          <span className="block w-[25px] h-[10px] border-t-2 border-[#eee]"></span>
          <span className="block w-[25px] h-[10px] border-t-2 border-[#eee]"></span>
        </label>
      </div>

      {/* Links Section - Desktop */}
      <div className="hidden md:flex md:items-center md:flex-grow">
        {/* Left-positioned links */}
        <div className="flex items-center justify-start flex-grow">
          {leftLinks.map((link, index) => renderLink(link, index))}
        </div>{" "}
        {/* Right-positioned links */}
        <div className="flex items-center justify-end">
          {rightLinks.map((link, index) => renderLink(link, index))}
          {renderLogoutButton()}
        </div>
      </div>

      {/* Links Section - Mobile */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={toggleMenu}
        >
          {" "}
          <div
            className="absolute w-full bg-[#333] top-[50px] left-0 h-auto max-h-[calc(100vh-50px)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* All links in mobile view */}
            {links.map((link, index) => renderLink(link, index, true))}
            {/* Logout button in mobile view */}
            {renderLogoutButton(true)}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
