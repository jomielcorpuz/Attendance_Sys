import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Props = {
    title: string
    icon: LucideIcon
    value: string
}
const SummaryCard = ({ title, icon: Icon, value }: Props) => {

    return (
        <Card>
            <CardHeader className="flex flex-row itesm-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg text-gray-700 font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">


                    <Icon className="h-6 w-6 text-primary" />

                    <span className="text-2xl text-gray-800 font-bold">{value}</span>
                </div>
            </CardContent>
        </Card>
    );

};

export default SummaryCard
