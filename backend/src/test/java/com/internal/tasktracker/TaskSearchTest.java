package com.internal.tasktracker;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class TaskSearchTest {
    @Autowired MockMvc mvc;

    @Test void excludesArchivedAndAppliesStatusToBothSearchBranches() throws Exception {
        mvc.perform(get("/api/tasks").param("q", "api").param("status", "OPEN").param("pageSize", "100"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.total").value(6))
            .andExpect(jsonPath("$.items[*].archived", everyItem(is(false))))
            .andExpect(jsonPath("$.items[*].status", everyItem(is("OPEN"))));
        mvc.perform(get("/api/tasks").param("pageSize", "100"))
            .andExpect(jsonPath("$.total").value(47))
            .andExpect(jsonPath("$.items[*].archived", everyItem(is(false))));
    }

    @Test void validatesInputsAndHandlesLargePagesWithoutOverflow() throws Exception {
        for (String[] input : new String[][] { {"page", "0"}, {"page", "-1"},
                {"pageSize", "0"}, {"pageSize", "101"}, {"status", "bogus"} }) {
            mvc.perform(get("/api/tasks").param(input[0], input[1])).andExpect(status().isBadRequest());
        }
        mvc.perform(get("/api/tasks").param("page", "2147483647"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.items", hasSize(0)));
        mvc.perform(get("/api/tasks").param("status", " open ").param("pageSize", "100"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.items[*].status", everyItem(is("OPEN"))));
    }

    @Test void paginationHasNoOverlap() throws Exception {
        mvc.perform(get("/api/tasks").param("page", "1").param("pageSize", "5"))
            .andExpect(jsonPath("$.items[0].id").value(49)).andExpect(jsonPath("$.items[4].id").value(45));
        mvc.perform(get("/api/tasks").param("page", "2").param("pageSize", "5"))
            .andExpect(jsonPath("$.items[0].id").value(44)).andExpect(jsonPath("$.items[4].id").value(40));
    }
}

