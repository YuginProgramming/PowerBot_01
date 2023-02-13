const statusesBefore = [
    { id: 0, status: 1 },
    { id: 1, status: 0 },
    { id: 2, status: 1 },
    { id: 3, status: 0 },
    { id: 4, status: 1 },
    { id: 5, status: 0 },
    { id: 6, status: 1 }
];

const statusesAfter = [
    { id: 0, status: 1 },
    { id: 1, status: 0 },
    { id: 2, status: 1 },
    { id: 3, status: 0 },
    { id: 4, status: 1 },
    { id: 5, status: 1 },
    { id: 6, status: 1 }
];

const compareStates = () => {
    return statusesAfter.filter(After => 
        statusesBefore.find(Before => Before.id === After.id).status !== After.status
    );
};

console.log(compareStates());