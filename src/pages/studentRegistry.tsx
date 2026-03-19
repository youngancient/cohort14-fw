import { mockStudents } from '../data/mockData'

function StudentRegistry() {
	return (
		<main className="px-5 py-7 sm:px-9 lg:px-[56px] lg:py-7">
			<p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1459d3]">Registry</p>
			<h2 className="mt-2 text-[36px] font-semibold leading-none text-[#161c25]">Student Registry</h2>
			<p className="mt-3 max-w-[720px] text-[13px] leading-7 text-[#4d5562]">
				Manage enrollment, academic status, and contact details for all active students.
			</p>

			<div className="mt-8 grid gap-4 md:grid-cols-3">
				<article className="rounded-lg border border-[#dde2e9] bg-white px-6 py-5">
					<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a919d]">Total Students</p>
					<h3 className="mt-3 text-[36px] font-semibold text-[#161c25]">1,248</h3>
					<p className="mt-2 text-[12px] font-semibold text-[#4e88de]">+4.2% this term</p>
				</article>

				<article className="rounded-lg border border-[#dde2e9] bg-white px-6 py-5">
					<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a919d]">Active Programs</p>
					<h3 className="mt-3 text-[36px] font-semibold text-[#161c25]">18</h3>
					<p className="mt-2 text-[12px] font-semibold text-[#2d9b6f]">Stable enrollment</p>
				</article>

				<article className="rounded-lg border border-[#dde2e9] bg-white px-6 py-5">
					<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a919d]">Pending Reviews</p>
					<h3 className="mt-3 text-[36px] font-semibold text-[#161c25]">32</h3>
					<p className="mt-2 text-[12px] font-semibold text-[#d9651f]">Requires follow-up</p>
				</article>
			</div>

			<section className="mt-8 rounded-lg border border-[#dde2e9] bg-white p-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<h4 className="text-[20px] font-semibold text-[#161c25]">Recent Students</h4>
					<button
						type="button"
						className="rounded-md bg-[#1457d2] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_4px_8px_rgba(20,87,210,0.28)] transition hover:bg-[#1048b3]"
					>
						+ Add Student
					</button>
				</div>

				<div className="mt-5 grid gap-3">
					{mockStudents.map((student) => (
						<div
							key={student.id}
							className="flex flex-col gap-3 rounded-lg border border-[#eef1f5] bg-[#f9fafc] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
						>
							<div className="flex items-center gap-3">
								<img
									src={student.image}
									alt={student.name}
									className="h-10 w-10 rounded-full object-cover"
								/>
								<div>
									<p className="text-[14px] font-semibold text-[#161c25]">{student.name}</p>
									<p className="mt-1 text-[12px] text-[#7c8796]">
										Level {student.level} • Age {student.age}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3 text-[12px] font-semibold text-[#7c8796]">
								<span>{student.wallet}</span>
								<span className="rounded-full bg-[#e8f0fe] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#4e88de]">
									{student.paymentStatus}
								</span>
							</div>
						</div>
					))}
				</div>
			</section>
		</main>
	)
}

export default StudentRegistry
