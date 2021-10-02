package com.example.library.model.UserToken;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.metamodel.StaticMetamodel;
import java.io.Serializable;
import java.util.Date;

@Embeddable
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@StaticMetamodel(TokenKey.class)
public class TokenKey  implements Serializable {
    @Column(name = "user_id")
    Long userId;

    @Column(name = "created_at")
    Date createdAt;
}
