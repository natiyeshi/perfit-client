const d  = [
    { "name": "Calcium 600mg +Vitamin D 400IU + Magnesium 50mg", "brand": "Sycal", "unit": "PK" },
    { "name": "Gentamycin 0.03% of 5ml eye drop", "brand": "Gentocil", "unit": "Tube" },
    { "name": "Bisacodyl 10mg  Suppository", "brand": "Bisease", "unit": "PK" },
    { "name": "Prednisolone 5mg  Tablets", "brand": "Prednova", "unit": "PK" },
    { "name": "Simethicone + Dill oil + Fennel oil of 30ml Drop", "brand": "Coliza", "unit": "Bottle" },
    { "name": "Timolol maleate 0.5% of 7.5ml Eye Drop", "brand": "Timoglau", "unit": "Tube" },
    { "name": "Diclofenac 100mg of 2x5 Suppositroy", "brand": "Estrofenac", "unit": "PK" },
    { "name": "Paracetamol 125mg of 2x5 Suppository", "brand": "Suppol", "unit": "pk" },
    { "name": "Paracetamol 250mg of 2x5 Suppository", "brand": "Suppol", "unit": "PK" },
    { "name": "Miconazole + Neomycin + Beclomethasone dipropionate of 15gm Ointment", "brand": "Beclem", "unit": "Tube" },
    { "name": "Diclofenac 1% 30G Gel", "brand": "Lofen", "unit": "Tube" },
    { "name": "Vitamin B Complex + Vitamin D3 0.8mg + Calcium 500mg of 3x10 Tablets", "brand": "Vitcal", "unit": "PK" },
    { "name": "Clotrimazole 100mg of 1x6 Vaginal Tablets", "brand": "Cotrisan V6", "unit": "PK" },
    { "name": "(Zinc Acetate) 20mg/5ml of 100ml Syrup", "brand": "Corzinc", "unit": "Bottle" },
    { "name": "Clotrimazole 1% Cream of 15gm", "brand": "Regesten", "unit": "Tube" },
    { "name": "Hydrocortisone 1% of 20gm Ointment", "brand": "H Cort Forte", "unit": "Tube" },
    { "name": "Fusidic Acid 2% cream of 15gm", "brand": "Fusi-Aid", "unit": "Tube" },
    { "name": "Guaifenesin 100mg/5ml of 100ml Solution", "brand": "Coral's Guaifenesin", "unit": "Bottle" },
    { "name": "Guaifenesin + Bromhexine + Terbutaline + Levamenthol) of 100ml Syrup", "brand": "Asmaril Expectorant", "unit": "Bottle" },
    { "name": "Aciclovir 5% Cream of 15gm", "brand": "CORAL'S ACICLOVIR", "unit": "Tube" },
    { "name": "Clotrimazole + Gentamycin + Beclomethasone Dipropionate of 20gm Cream", "brand": "Dermaguard Plus", "unit": "Tube" },
    { "name": "Sildenafil 50mg of 2x4 Tablets", "brand": "D Zire", "unit": "PK" },
    { "name": "Dried Aluminium Hydroxide + Magnesium Hydroxide + Simethicone) of 200ml Suspension", "brand": "Corasil suspension", "unit": "Bottle" },
    { "name": "Diclofenac Diethylamine + Methyl Salicylate + Levamenthol + Linseed Oil of 30g Gel", "brand": "Dofec Plus", "unit": "Tube" },
    { "name": "Salbutamol + Bromhexine + Guaifenesin + Levamenthol of 100ml Syrup", "brand": "Salbumol Plus", "unit": "Bottle" },
    { "name": "Clobetasol propionate 0.05% ointment of 20gm", "brand": "CUTISONE", "unit": "Tube" },
    { "name": "Multivitamin with Multimineral and Antioxidant) of 3x10 Capsules", "brand": "Vitpax", "unit": "PK" },
    { "name": "Albendazole 400mg Chewable (Orange Flavored) of 1 Tablet", "brand": "Worminix", "unit": "PK" },
    { "name": "Ferrous Fumarate 300mg + Vitamin B12 15mcg + Folic Acid 1.5mg of 10x10 Tablets", "brand": "Redest", "unit": "PK" },
    { "name": "Salbutamol 4mg of 10x10 Tablets", "brand": "Salburest", "unit": "PK" },
    { "name": "Hydrocortisone 1% of 20gm Cream", "brand": "H Cort Forte", "unit": "Tube" },
    { "name": "Multi-Vitamin & Multi-Minerals of 100ml Syrup", "brand": "Zentop", "unit": "Bottle" },
    { "name": "(Vitamin E 400 IU) of 3x10 Softgel Capsules", "brand": "EGEL-CAP", "unit": "PK" },
    { "name": "Ketoconazole 2% Cream of 15gm", "brand": "Ketovate", "unit": "" },
    { "name": "Compound Magnesium Trisilicate+ Aluminium Hydroxide 250mg +120mg 10*10 Tablet", "brand": "Corasil Tablet", "unit": "PK" }
  ]

  

fetch('https://example.com/api/data', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(d)
})
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });