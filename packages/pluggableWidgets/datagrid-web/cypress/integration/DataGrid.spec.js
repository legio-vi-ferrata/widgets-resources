describe("datagrid-web", () => {
    const cleanMendixSession = () => {
        cy.window().then(window => {
            // Cypress opens a new session for every test, so it exceeds mendix license limit of 5 sessions, we need to logout after each test.
            window.mx.session.logout();
        });
    };

    beforeEach(() => {
        cy.visit("/"); // resets page
    });

    afterEach(() => cleanMendixSession());

    describe("capabilities: sorting", () => {
        it("applies the default sort order from the data source option", () => {
            cy.get(".mx-name-datagrid1 .column-header").eq(1).should("have.text", "First Name");
            cy.get(".mx-name-datagrid1 .column-header")
                .eq(1)
                .find("svg")
                .should("have.attr", "data-icon", "arrows-alt-v");
            cy.wait(1000);
            cy.get(".mx-name-datagrid1 .td").should("have.text", "12test3test311test2test210testtest");
        });

        it("changes order of data to ASC when clicking sort option", () => {
            cy.get(".mx-name-datagrid1 .column-header").eq(1).should("have.text", "First Name");
            cy.get(".mx-name-datagrid1 .column-header")
                .eq(1)
                .find("svg")
                .should("have.attr", "data-icon", "arrows-alt-v");
            cy.get(".mx-name-datagrid1 .column-header").eq(1).click();
            cy.wait(1000);
            cy.get(".mx-name-datagrid1 .column-header")
                .eq(1)
                .find("svg")
                .should("have.attr", "data-icon", "long-arrow-alt-up");
            cy.get(".mx-name-datagrid1 .td").should("have.text", "10testtest11test2test212test3test3");
        });

        it("changes order of data to DESC when clicking sort option", () => {
            cy.get(".mx-name-datagrid1 .column-header").eq(1).should("have.text", "First Name");
            cy.get(".mx-name-datagrid1 .column-header").eq(1).dblclick();
            cy.wait(1000);
            cy.get(".mx-name-datagrid1 .column-header")
                .eq(1)
                .find("svg")
                .should("have.attr", "data-icon", "long-arrow-alt-down");
            cy.get(".mx-name-datagrid1 .td").should("have.text", "12test3test311test2test210testtest");
        });
    });

    // TODO: Fix this test as cypress is not moving the element correctly
    // describe("capabilities: resizing", () => {
    //     it("changes the size of the column", () => {
    //         cy.get(".mx-name-datagrid1 .column-header")
    //             .first()
    //             .then(el => {
    //                 const [column] = el;
    //                 const size = column.getBoundingClientRect();
    //
    //                 cy.get(".mx-name-datagrid1 .th[role=columnheader]")
    //                     .first()
    //                     .find(".column-resizer")
    //                     .trigger("mousedown", { force: true })
    //                     .trigger("mousemove", 30, 0, { force: true })
    //                     .trigger("mouseup", { force: true });
    //
    //                 cy.get(".mx-name-datagrid1 .column-header")
    //                     .invoke("outerWidth")
    //                     .should("eq", size.width + 30);
    //             });
    //     });
    // });

    describe("capabilities: hiding", () => {
        it("hides a selected column", () => {
            cy.get(".mx-name-datagrid1 .column-header").first().should("be.visible");
            cy.get(".mx-name-datagrid1 .column-selector-button").click();
            cy.get(".column-selectors > li").first().click();
            cy.wait(1000);
            cy.get(".mx-name-datagrid1 .column-header").first().should("not.be.visible");
        });
    });

    describe("capabilities: onClick action", () => {
        it("check the context", () => {
            cy.get(".mx-name-datagrid1 .td").first().should("have.text", "12");
            cy.get(".mx-name-datagrid1 .td").first().click();
            cy.wait(1000);
            cy.get(".mx-name-AgeTextBox input").should("have.value", "12");
        });
    });
});
