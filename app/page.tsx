"use client";

import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { Select, SelectItem } from "@heroui/select";
import { Header } from "@/components/header";

const exams = [
	{ key: "Creatinina", label: "Creatinina" },
	{ key: "Glóbulos Vermelhos", label: "Glóbulos Vermelhos" },
	{ key: "Glóbulos Brancos", label: "Glóbulos Brancos" },
];

export default function Home() {
	return (
		<>
			<Header />
			<section className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 p-4 gap-4">
				<div className="flex flex-col gap-4">
					<div className="mb-6">
						<h1 className="text-3xl text-slate-800 mb-0 font-bold">
							Formulário de criação de exame
						</h1>
						<h2 className="text-lg text-slate-800">
							Preencha as informações abaixo para gerar um novo
							exame
						</h2>
					</div>

					<Input label="Nome do Pet" placeholder="Ex: Bobby" />
					<Input
						label="Nome do Tutor"
						placeholder="Ex: Maria da Silva"
					/>

					<Divider className="my-4" />

					<div className="flex items-center justify-center gap-2">
						<Select className="max-w-xs" label="Selecione">
							{exams.map((item) => (
								<SelectItem key={item.key}>
									{item.label}
								</SelectItem>
							))}
						</Select>
						<Input
							label="Valor do exame"
							placeholder="Digite aqui"
						/>
						<Input
							label="Valor de referência"
							placeholder="Digite aqui"
						/>

						<div>
							<Link isBlock color="danger" href="#">
								<AiOutlineMinusCircle className="text-danger-500" />
							</Link>
						</div>
					</div>

					<div>
						<Link isBlock color="primary" href="#">
							<AiOutlinePlusCircle className="mr-2" />
							Adicionar exame
						</Link>
					</div>
				</div>

				<div className="p-4 w-full">
					<Card className="w-full">
						<CardBody>
							<p>
								Make beautiful websites regardless of your
								design experience.
							</p>
						</CardBody>
					</Card>
				</div>
			</section>
		</>
	);
}
