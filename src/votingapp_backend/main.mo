import List "mo:base/List";
import Nat "mo:base/Nat";
import Bool "mo:base/Bool";
import Principal "mo:base/Principal";

actor main{
// Data structure definitions
type Candidate = {
    id: Nat;            // Unique identifier for the candidate
    name: Text;         // Candidate name
    electionId: Nat;    // ID of the election the candidate belongs to
    votes: Nat;         // Vote count for the candidate
};

type Election = {
    id: Nat;            // Unique identifier for the election
    title: Text;        // Election name/title
    isOpen: Bool;       // Status of the election (open or closed)
};
type voters ={
    voter: Principal;
    electionId: Nat;
};

// Stable variables for persistence
stable var elections: List.List<Election> = List.nil<Election>();
stable var candidates: List.List<Candidate> = List.nil<Candidate>();
stable var voterRegistry: List.List<(Principal, Nat)> = List.nil(); 

public func CreateElection(title: Text): async Text{
    let newId = List.size(elections) + 1;

    let newElection = {
        id = newId;
        title = title;
        isOpen= false;
    };
   elections := List.push(newElection, elections);

   return "Election Titled '"#title#"' has been added sucessfully";
};
public func addCandidate(electionId: Nat, name: Text): async Text {
    // Check if the election exists
    let electionOpt = List.find<Election>(elections, func(e: Election) : Bool{ e.id == electionId });
    switch (electionOpt) {
        case (?election) {
            // Generate a unique ID for the new candidate
            let newCandidateId = List.size(candidates) + 1;

            // Create the new candidate object
            let newCandidate = {
                id = newCandidateId;
                name = name;
                electionId = electionId;
                votes = 0;
            };

            // Add the new candidate to the candidates list
            candidates := List.push(newCandidate, candidates);

            return "Candidate " # name # " added successfully to election ID "#Nat.toText(electionId) #"!";
        };
        case null { return "Election with ID " # Nat.toText(electionId) # " not found."; };
    };
};

public func getElections(): async [Election] {
    return List.toArray(elections);
};

public func getCandidates(electionId: Nat): async [Candidate] {
    return List.toArray(
    List.filter<Candidate>(candidates, func(c: Candidate): Bool{
        c.electionId == electionId;
    })
    );
};

public func openVote(ElectionId:Nat) : async Text{
   
     elections := List.map<Election, Election>(elections, func(e: Election) : Election{
            if (e.isOpen == false) { 
                { e with isOpen = true }; 
                    } else { e };
                     });
                    return "Election "#Nat.toText(ElectionId)#" has sucessfully started!"
                };
           


public func castVote(electionId: Nat, candidateId: Nat): async Text {
    let caller = Principal.toText(Principal.fromActor(main));

    // Check if the election exists
    let electionOpt = List.find<Election>(elections, func(e: Election) : Bool{ e.id == electionId });
    switch (electionOpt) {
        case (?election) {
            if (election.isOpen == false) {
                return "Election is closed!";
            };

            // Check if the user has already voted in this election
            var hasVoted = false;
            var i = 0;
            while (i < List.size(voterRegistry)) {
                switch (List.get(voterRegistry, i)) {
                    case (?entry) {
                        if (entry.0 == caller and entry.1 == electionId) {
                            hasVoted := true;
                           
                        };
                    };
                    case null {};
                };
                i := i + 1;
            };
            if (hasVoted) {
                return "You have already voted in this election!";
            };
                

            // Find the candidate
            let candidateOpt = List.find<Candidate>(candidates, func(c : Candidate): Bool { c.id == candidateId });
            switch (candidateOpt) {
                case (?candidate) {
                    // Increment the vote count
                    candidates := List.map<Candidate, Candidate>(candidates, func(c: Candidate) : Candidate{
                        if (c.id == candidateId) { 
                            { c with votes = c.votes + 1 }; 
                        } else { c };
                    });
                    

                    // Register the voter
                    voterRegistry := List.push((Principal.fromActor(main), electionId), voterRegistry);

                    return "Vote cast successfully for " # candidate.name # "!";
                };
                case null { return "Candidate not found!"; };
            };
        };
        case null { return "Election not found!"; };
    };
}


}