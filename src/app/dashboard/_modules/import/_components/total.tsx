import { IDBClientImport } from "@/types/IImport";


const TotalShow = ({imports }: {imports : IDBClientImport[]}) => {
    const total = (imports ?? []).reduce((sum, imp) => sum + (Number(imp.amount) || 0), 0);
    return (
        <div className="p- text-black px-6">
            <div className="flex items-center justify-between">
                <span>Total Amount</span>
                <span className="font-semibold text-lg">
                    ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>
        </div>  
    )
}

export default TotalShow;