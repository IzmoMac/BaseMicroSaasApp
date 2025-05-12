import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface MonthlyData {
    month: string;
    cost: string;
}

interface MonthlyCarouselProps {
    data: MonthlyData[];
}

export function MonthlyCarousel({ data }: MonthlyCarouselProps) {
    const getCurrentMonthIndex = () => {
        const currentMonth = new Date().toLocaleString("default", { month: "long" });
        return data.findIndex(item => item.month.toLowerCase() === currentMonth.toLowerCase());
    };

    const [currentIndex, setCurrentIndex] = useState(() => {
        const defaultIndex = getCurrentMonthIndex();
        return defaultIndex !== -1 ? defaultIndex : 0;
    });

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? data.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === data.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    if (data.length === 0) {
        return (
            <div className="py-4 text-center text-gray-500">No data available</div>
        );
    }

    return (
        <div className="relative rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
            <div className="flex items-center justify-between">
                <button
                    onClick={goToPrevious}
                    className="rounded-full bg-gray-200 p-1 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                >
                    <FaChevronLeft className="h-5 w-5" />
                </button>

                <div className="text-center">
                    <h4 className="text-sm font-medium">
                        {data[currentIndex].month}
                    </h4>
                    <p className="mt-1 text-xl font-semibold">
                        {data[currentIndex].cost}
                    </p>
                </div>

                <button
                    onClick={goToNext}
                    className="rounded-full bg-gray-200 p-1 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                >
                    <FaChevronRight className="h-5 w-5" />
                </button>
            </div>

            <div className="mt-3 flex justify-center">
                {data.map((_, index) => (
                    <div
                        key={index}
                        className={`mx-1 h-1.5 w-1.5 rounded-full ${index === currentIndex
                                ? "bg-blue-500"
                                : "bg-gray-300 dark:bg-gray-500"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
