import {
	BiAt,
	BiLogoTelegram,
	BiSolidLike,
	BiSolidStar,
	BiUserCircle,
} from "react-icons/bi"
import { BsChatFill, BsFillLightbulbFill } from "react-icons/bs"
import {
	FaBasketballBall,
	FaBriefcase,
	FaChartLine,
	FaClipboardList,
	FaCrown,
	FaGraduationCap,
	FaUserCircle,
} from "react-icons/fa"
import {
	FaBell,
	FaBookOpen,
	FaFolder,
	FaHeart,
	FaUserGroup,
} from "react-icons/fa6"
import { GiDominoMask } from "react-icons/gi"
import { HiPaintBrush } from "react-icons/hi2"
import { ImGlass2 } from "react-icons/im"
import {
	IoCallOutline,
	IoChatbubblesSharp,
	IoGameControllerSharp,
	IoHome,
	IoMegaphone,
	IoMusicalNote,
} from "react-icons/io5"
import { PiAirplaneTiltFill, PiCatFill } from "react-icons/pi"
import { RiAndroidFill, RiFlowerFill } from "react-icons/ri"
import { SiBitcoinsv } from "react-icons/si"
import { VscSettings } from "react-icons/vsc"

import { IconType } from "react-icons/lib"

export type IconsRendererType =
	| "Cat"
	| "Book"
	| "Coin"
	| "Controller"
	| "Bulb"
	| "Like"
	| "Music"
	| "Brush"
	| "Air"
	| "Ball"
	| "Star"
	| "GraduationCap"
	| "Telegram"
	| "User"
	| "Group"
	| "AllChats"
	| "Dialog"
	| "Android"
	| "Crown"
	| "Flower"
	| "Home"
	| "Heart"
	| "Mask"
	| "Glass"
	| "Chart"
	| "BriefCase"
	| "Bell"
	| "Megaphone"
	| "Folder"
	| "Clipboard"
	| "Settings"
	| "User2"
	| "At"
	| "Call"

export const iconList: { name: IconsRendererType; icon: IconType }[] = [
	{
		name: "Cat",
		icon: PiCatFill,
	},
	{
		name: "Book",
		icon: FaBookOpen,
	},
	{
		name: "Coin",
		icon: SiBitcoinsv,
	},
	{
		name: "Controller",
		icon: IoGameControllerSharp,
	},
	{
		name: "Bulb",
		icon: BsFillLightbulbFill,
	},
	{
		name: "Like",
		icon: BiSolidLike,
	},
	{
		name: "Music",
		icon: IoMusicalNote,
	},
	{
		name: "Brush",
		icon: HiPaintBrush,
	},
	{
		name: "Air",
		icon: PiAirplaneTiltFill,
	},
	{
		name: "Ball",
		icon: FaBasketballBall,
	},
	{
		name: "Star",
		icon: BiSolidStar,
	},
	{
		name: "GraduationCap",
		icon: FaGraduationCap,
	},
	{
		name: "Telegram",
		icon: BiLogoTelegram,
	},
	{
		name: "User",
		icon: FaUserCircle,
	},
	{
		name: "Group",
		icon: FaUserGroup,
	},
	{
		name: "AllChats",
		icon: IoChatbubblesSharp,
	},
	{
		name: "Dialog",
		icon: BsChatFill,
	},
	{
		name: "Android",
		icon: RiAndroidFill,
	},
	{
		name: "Crown",
		icon: FaCrown,
	},
	{
		name: "Flower",
		icon: RiFlowerFill,
	},
	{
		name: "Home",
		icon: IoHome,
	},
	{
		name: "Heart",
		icon: FaHeart,
	},
	{
		name: "Mask",
		icon: GiDominoMask,
	},
	{
		name: "Glass",
		icon: ImGlass2,
	},
	{
		name: "Chart",
		icon: FaChartLine,
	},
	{
		name: "BriefCase",
		icon: FaBriefcase,
	},
	{
		name: "Bell",
		icon: FaBell,
	},
	{
		name: "Megaphone",
		icon: IoMegaphone,
	},
	{
		name: "Folder",
		icon: FaFolder,
	},
	{
		name: "Clipboard",
		icon: FaClipboardList,
	},
	{
		name: "Settings",
		icon: VscSettings,
	},
	{
		name: "User2",
		icon: BiUserCircle,
	},
	{
		name: "Call",
		icon: IoCallOutline,
	},
	{
		name: "At",
		icon: BiAt,
	},
]
