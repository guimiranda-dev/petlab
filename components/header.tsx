"use client";

import Image from "next/image";
import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
} from "@heroui/dropdown";
import { MdMenu } from "react-icons/md";
import { logout } from "@/app/login/actions";

export function Header() {
	return (
		<div className="bg-[#faf8f5]">
			<div className="container mx-auto max-w-7xl flex justify-between items-center p-2">
				<Image
					src="/assets/logo.png"
					alt="logo"
					width={60}
					height={60}
				/>

				<Dropdown>
					<DropdownTrigger>
						<div className="flex gap-2 items-center cursor-pointer">
							<MdMenu className="text-xl text-gray-800" />
						</div>
					</DropdownTrigger>
					<DropdownMenu>
						<DropdownItem key="logout" onPress={logout}>
							Sair
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</div>
		</div>
	);
}
