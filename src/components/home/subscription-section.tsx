import { BadgeCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export function SubscriptionSection() {
  return (
    <section className="py-10 bg-[#080808]">
      <div className="max-w-[1280px] mx-auto px-5">
        <div className="machined-border p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 bg-gradient-to-br from-surface-container-low to-black">
          <div className="flex-1 fast-fade-in">
            <h2 className="text-4xl font-bold mb-6">
              Keep Your Car Clean Year-Round with Our Monthly Plan
            </h2>
            <p className="text-on-surface-variant mb-8 text-lg normal-case not-italic">
              Join the Revved Inner Circle for monthly maintenance details at a
              30% discount. Perfect for keeping your car detailing miami fl
              investment looking brand new every single day.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-full border border-outline-variant/30">
                <BadgeCheck className="text-primary-container size-4" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Priority Scheduling
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-full border border-outline-variant/30">
                <BadgeCheck className="text-primary-container size-4" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Exclusive Rates
                </span>
              </div>
            </div>

            <Link
              href="/booking"
              className="text-primary-container font-bold flex items-center gap-2 hover:translate-x-2 transition-transform"
            >
              EXPLORE MEMBERSHIPS <ArrowRight className="size-5" />
            </Link>
          </div>

          <div
            className="w-full md:w-[400px] aspect-[4/5] bg-surface-container relative fast-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <div
              className="absolute inset-0 bg-center bg-cover"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBKN1bk1xsU_Suh7n-mY1_wbuPzgTi-0A-YY9wNt4QyQHx9uPd4qt0KegqF9ypSbUJd7RlxLubLQ_mJQmlFoGXTaf-Vei9cj76aLGfIg5hKXDXnVJiqb2-VkRBEgY6wZD8tl-vvBwMHTWTukV09dpgtVGGrvuI52CQCcaC6g10WK_Fsroa2QEKYKgB2gzdQ0T-i20xXdsqJgcGF5NIfrgOdX8OyBh9UQgtgRbUB3BPaPf3dUHkWldJGI2FXu-t-WTPMCqt0u78sq0')",
              }}
            />
            <div className="absolute inset-0 border border-primary-container/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
